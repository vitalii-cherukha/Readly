const modal = document.getElementById('signupModal');
const btn = document.getElementById('signupBtn');
const span = document.querySelector('.close-btn');
const alertBox = document.getElementById('customAlert');
const alertText = document.getElementById('alertText');

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function showAlert(message) {
  alertText.textContent = message;
  alertBox.style.display = 'block';

  setTimeout(() => {
    alertBox.style.display = 'none';
  }, 3000);
}

btn.addEventListener('click', function (event) {
  event.preventDefault();
  const emailInput = document.getElementById('emailInput');
  const email = emailInput.value.trim();

  if (!email) {
    showAlert('Enter email please.');
    return;
  }

  if (!isValidEmail(email)) {
    showAlert('Wrong email. Please try again!');
    return;
  }

  localStorage.setItem('userEmail', email);

  emailInput.value = '';

  modal.style.display = 'block';
});

span.onclick = function () {
  modal.style.display = 'none';
};

window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && modal.style.display === 'block') {
    modal.style.display = 'none';
  }
});
