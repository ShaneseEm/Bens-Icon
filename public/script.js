const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
const reservationForm = document.getElementById('reservationForm');
const formStatus = document.getElementById('formStatus');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });
}

if (reservationForm) {
  reservationForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    formStatus.textContent = 'Sending request...';

    const formData = new FormData(reservationForm);
    const payload = {
      name: formData.get('name').trim(),
      email: formData.get('email').trim(),
      message: formData.get('message').trim()
    };

    try {
      const response = await fetch('/api/reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Unable to send request');
      }

      reservationForm.reset();
      formStatus.textContent = 'Thank you! Your request was sent successfully.';
    } catch (error) {
      formStatus.textContent = error.message;
    }
  });
}
