document.addEventListener('DOMContentLoaded', () => {
  console.log('script.js loaded');

  // ---------------- Homepage Logic ----------------
  if (isHomepage()) {
    const tabList = document.querySelector('[role="tablist"]');
    const tabs = tabList.querySelectorAll(':scope > [role="tab"]');

    tabs.forEach((tab) => {
      tab.addEventListener('click', changeTabs);
      tab.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          changeTabs(e);
        }
      });
    });

    let tabFocus = 0;
    tabList.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        tabs[tabFocus].setAttribute('tabindex', -1);
        tabFocus =
          e.key === 'ArrowRight'
            ? (tabFocus + 1) % tabs.length
            : (tabFocus - 1 + tabs.length) % tabs.length;
        tabs[tabFocus].setAttribute('tabindex', 0);
        tabs[tabFocus].focus();
      }
    });
  }

  // ---------------- Booking Page Logic ----------------
  if (isBookingPage()) {
    const reservationForm = document.getElementById('reservationForm');
    const nameEl = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const nameErrorEl = document.getElementById('nameError');
    const emailErrorEl = document.getElementById('emailError');
    const dateErrorEl = document.getElementById('dateError');
    const timeErrorEl = document.getElementById('timeError');

    reservationForm?.addEventListener('submit', (e) => {
      let hasError = false;
      const email_check =
        /^([A-Za-z0-9_\-\.])+@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

      nameErrorEl.innerHTML = '';
      emailErrorEl.innerHTML = '';
      dateErrorEl.innerHTML = '';
      timeErrorEl.innerHTML = '';

      if (!nameEl.value.trim()) {
        nameErrorEl.innerHTML = 'This field is required';
        hasError = true;
      }

      if (!emailEl.value.trim()) {
        emailErrorEl.innerHTML = 'This field is required';
        hasError = true;
      } else if (!emailEl.value.match(email_check)) {
        emailErrorEl.innerHTML = 'Please use a valid email address';
        hasError = true;
      }

      const month = document.getElementById('month').value.trim();
      const day = document.getElementById('day').value.trim();
      const year = document.getElementById('year').value.trim();
      if ([month, day, year].filter(Boolean).length < 3) {
        dateErrorEl.innerHTML = 'This field is incomplete';
        hasError = true;
      }

      const hour = document.getElementById('hour').value.trim();
      const minute = document.getElementById('minute').value.trim();
      if ([hour, minute].filter(Boolean).length < 2) {
        timeErrorEl.innerHTML = 'This field is incomplete';
        hasError = true;
      }

      if (hasError) e.preventDefault();
      else console.log('Form submitted successfully!');
    });

    const button = document.getElementById('dropdownButton');
    const menu = document.getElementById('dropdownMenu');
    const selectedValue = document.getElementById('selectedValue');
    const options = document.querySelectorAll('.dropdown-option');
    const arrowImage = button?.querySelector('img');

    button?.addEventListener('click', () => {
      menu?.classList.toggle('active');
      if (arrowImage)
        arrowImage.style.transform = menu?.classList.contains('active')
          ? 'rotate(180deg)'
          : 'rotate(0deg)';
    });

    options.forEach((option) => {
      option.addEventListener('click', () => {
        options.forEach((o) => o.classList.remove('selected'));
        option.classList.add('selected');
        selectedValue.textContent = option.dataset.value;

        menu?.classList.remove('active');
        if (arrowImage) arrowImage.style.transform = 'rotate(0deg)';
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown')) {
        menu?.classList.remove('active');
        if (arrowImage) arrowImage.style.transform = 'rotate(0deg)';
      }
    });

    let peopleCount = 4;
    const peopleDisplay = document.getElementById('peopleCount');
    const peopleInput = document.getElementById('peopleInput');
    const incrementBtn = document.querySelector('.increment');
    const decrementBtn = document.querySelector('.decrement');

    function updatePeopleDisplay() {
      peopleDisplay.textContent = `${peopleCount} people`;
      peopleInput.value = peopleCount;
    }

    updatePeopleDisplay();

    incrementBtn?.addEventListener('click', () => {
      peopleCount++;
      updatePeopleDisplay();
    });

    decrementBtn?.addEventListener('click', () => {
      if (peopleCount > 1) {
        peopleCount--;
        updatePeopleDisplay();
      }
    });

    function handlePeopleKeyPress(event, action) {
      const key = event.key;
      if (key === 'ArrowUp' || key === 'ArrowRight') {
        peopleCount++;
        updatePeopleDisplay();
        event.preventDefault();
      } else if (
        (key === 'ArrowDown' || key === 'ArrowLeft') &&
        peopleCount > 1
      ) {
        peopleCount--;
        updatePeopleDisplay();
        event.preventDefault();
      } else if (key === 'Enter' || key === ' ') {
        action();
        event.preventDefault();
      }
    }

    incrementBtn?.addEventListener('keydown', (e) => {
      handlePeopleKeyPress(e, () => {
        peopleCount++;
        updatePeopleDisplay();
      });
    });

    decrementBtn?.addEventListener('keydown', (e) => {
      handlePeopleKeyPress(e, () => {
        if (peopleCount > 1) {
          peopleCount--;
          updatePeopleDisplay();
        }
      });
    });
  }

  console.log('Script running on the page.');
});

// ------------- Helpers -------------
function isHomepage() {
  return (
    window.location.pathname === '/' ||
    window.location.pathname.endsWith('/index.html')
  );
}

function isBookingPage() {
  return window.location.pathname.endsWith('/booking.html');
}

function changeTabs(e) {
  const targetTab = e.target;
  const tabList = targetTab.parentNode;
  const tabGroup = tabList.parentNode;

  tabList
    .querySelectorAll(':scope > [aria-selected="true"]')
    .forEach((t) => t.setAttribute('aria-selected', false));
  targetTab.setAttribute('aria-selected', true);
  tabGroup
    .querySelectorAll(':scope > [role="tabpanel"]')
    .forEach((p) => p.setAttribute('hidden', true));
  tabGroup
    .querySelector(`#${targetTab.getAttribute('aria-controls')}`)
    .removeAttribute('hidden');
}
