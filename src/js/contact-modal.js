class ContactModal {
  constructor() {
    this.modal = document.querySelector('[data-contact-modal]');
    this.openBtns = document.querySelectorAll('[data-contact-open]');
    this.closeBtn = document.querySelector('[data-contact-close]');
    this.form = document.querySelector('[data-contact-form]');
    this.eventNameEl = document.querySelector('[data-event-name]');
    this.successMessage = document.querySelector('[data-success-message]');

    this.isOpen = false;
    this.currentEvent = '';

    this.init();
  }

  init() {
    if (!this.modal) return;

    this.bindEvents();
    this.setupFormValidation();
  }

  bindEvents() {
    this.closeBtn?.addEventListener('click', () => this.close());
    this.modal.addEventListener('click', e => {
      if (e.target === this.modal) this.close();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });

    this.form?.addEventListener('submit', e => this.handleSubmit(e));
  }

  setupFormValidation() {
    if (!this.form) return;

    const inputs = this.form.querySelectorAll('input, textarea');

    inputs.forEach(input => {
      input.addEventListener('input', () => this.validateField(input));
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('focus', () => this.hideFieldError(input));
    });
  }

  validateField(field) {
    const errorElement = field.parentNode.querySelector('.error-text');
    if (!errorElement) return;

    let isValid = true;
    let errorMessage = '';

    if (field.name === 'name') {
      if (!field.value.trim()) {
        isValid = false;
        errorMessage = 'Name is required';
      } else if (field.value.trim().length < 2) {
        isValid = false;
        errorMessage = 'Name must be at least 2 characters';
      } else if (field.value.trim().length > 50) {
        isValid = false;
        errorMessage = 'Name must be less than 50 characters';
      }
    }

    if (field.name === 'email') {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!field.value.trim()) {
        isValid = false;
        errorMessage = 'Email is required';
      } else if (!emailRegex.test(field.value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }

    if (field.name === 'message' && field.value.length > 500) {
      isValid = false;
      errorMessage = 'Message must be less than 500 characters';
    }

    errorElement.textContent = errorMessage;

    if (isValid) {
      field.classList.remove('invalid');
      field.classList.add('valid');
    } else {
      field.classList.remove('valid');
      field.classList.add('invalid');
    }

    return isValid;
  }

  hideFieldError(field) {
    const errorElement = field.parentNode.querySelector('.error-text');
    if (errorElement) {
    }
  }

  validateForm() {
    if (!this.form) return false;

    const requiredFields = this.form.querySelectorAll(
      'input[required], textarea[required]'
    );
    let isFormValid = true;

    requiredFields.forEach(field => {
      const fieldValid = this.validateField(field);
      if (!fieldValid) {
        isFormValid = false;
      }
    });

    return isFormValid;
  }

  async handleSubmit(event) {
    event.preventDefault();

    if (!this.validateForm()) {
      const firstInvalid = this.form.querySelector('.invalid');
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    const submitBtn = this.form.querySelector('.contact-form-btn');
    const originalText = submitBtn.textContent;

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Registering...';

      await this.simulateSubmission();

      this.showSuccess();
    } catch (error) {
      console.error('Registration failed:', error);
      this.showError('Registration failed. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  async simulateSubmission() {
    return new Promise(resolve => {
      setTimeout(resolve, 1500);
    });
  }

  showSuccess() {
    if (this.successMessage) {
      this.form.style.display = 'none';
      this.successMessage.style.display = 'flex';

      setTimeout(() => {
        this.close();
      }, 3000);
    }
  }

  showError(message) {
    alert(message);
  }

  open(eventName = '') {
    if (this.isOpen) return;

    this.currentEvent = eventName;

    if (this.eventNameEl && eventName) {
      this.eventNameEl.textContent = eventName;
    }

    this.resetForm();
    this.form.style.display = 'flex';
    this.successMessage.style.display = 'none';

    this.modal.classList.add('is-open');
    this.isOpen = true;

    const firstInput = this.form.querySelector('input');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 300);
    }

    document.body.style.overflow = 'hidden';
  }

  close() {
    if (!this.isOpen) return;

    this.modal.classList.remove('is-open');
    this.isOpen = false;

    document.body.style.overflow = '';

    setTimeout(() => {
      this.resetForm();
    }, 300);
  }

  resetForm() {
    if (!this.form) return;

    this.form.reset();

    const fields = this.form.querySelectorAll('input, textarea');
    fields.forEach(field => {
      field.classList.remove('valid', 'invalid');
    });

    const errorElements = this.form.querySelectorAll('.error-text');
    errorElements.forEach(error => {
      error.textContent = '';
    });
  }
}

let contactModalInstance;

document.addEventListener('DOMContentLoaded', () => {
  contactModalInstance = new ContactModal();
});

export function openContactModal(eventName) {
  if (contactModalInstance) {
    contactModalInstance.open(eventName);
  }
}

export default ContactModal;
