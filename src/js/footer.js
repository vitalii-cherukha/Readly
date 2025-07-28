document.addEventListener('footerEventListener', function () {
  const signupFormBtn = document.getElementById('signupForm');
  const signUpCloseBtn = document.getElementById('signUpCloseBtn');
  const footerModal = document.getElementById('footerModal');
  const emailInput = document.getElementById('footerSubsInput');

  signupFormBtn.addEventListener('submit', function (event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    if (!email) {
      alert('Пожалуйста, введите email!');
      return;
    }

    footerModal.style.display = 'block';
  });

  signUpCloseBtn.addEventListener('click', function () {
    footerModal.style.display = 'none';
  });

  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      footerModal.style.display = 'none';
    }
  });
});
