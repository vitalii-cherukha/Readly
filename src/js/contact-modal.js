class ContactModal {
  constructor() {
    this.modal = document.querySelector('[data-contact-modal]');
    this.modalContent = this.modal?.querySelector('.contact-modal-wrapper');
    this.openBtns = document.querySelectorAll('[data-contact-open]');
    this.closeBtn = document.querySelector('[data-contact-close]');
    this.form = document.querySelector('[data-contact-form]');
    this.eventNameEl = document.querySelector('[data-event-name]');
    this.successMessage = document.querySelector('[data-success-message]');

    this.isOpen = false;
    this.currentEvent = '';
    this.isFormInteraction = false;
    this.mouseDownOnOverlay = false;

    this.init();
  }

  init() {
    if (!this.modal) return;

    this.bindEvents();
    this.setupFormValidation();
    this.bindOpenButtons();
  }

  bindOpenButtons() {
    this.openBtns.forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        this.open(btn);
      });
    });
  }

  open(triggerBtn = null) {
    if (this.isOpen) return;

    if (triggerBtn) {
      const eventCard = triggerBtn.closest('.event-card');
      const eventTitle = eventCard?.querySelector('.event-subhead');
      if (eventTitle && this.eventNameEl) {
        this.currentEvent = eventTitle.textContent.trim();
        this.eventNameEl.textContent = this.currentEvent;
      }
    }

    this.resetForm();
    this.form.style.display = 'flex';
    this.successMessage.style.display = 'none';

    this.modal.classList.add('contact-modal-is-open');
    document.body.style.overflow = 'hidden';
    this.isOpen = true;
    this.isFormInteraction = false;
    this.mouseDownOnOverlay = false;
    setTimeout(() => {
      const firstInput = this.form?.querySelector('input');
      if (firstInput) {
        firstInput.focus();
        this.isFormInteraction = true;
      }
    }, 300);
  }

  close() {
    if (!this.isOpen) return;

    this.modal.classList.remove('contact-modal-is-open');
    document.body.style.overflow = '';
    this.isOpen = false;
    this.isFormInteraction = false;
    this.mouseDownOnOverlay = false;

    setTimeout(() => {
      this.resetForm();
    }, 300);
  }

  bindEvents() {
    this.closeBtn?.addEventListener('click', e => {
      e.stopPropagation();
      this.close();
    });

    this.modal.addEventListener('mousedown', e => {
      if (e.target === this.modal) {
        this.mouseDownOnOverlay = true;
        this.isFormInteraction = false;
      }
    });

    this.modal.addEventListener('mouseup', e => {
      if (
        e.target === this.modal &&
        this.mouseDownOnOverlay &&
        !this.isFormInteraction
      ) {
        this.close();
      }
      this.mouseDownOnOverlay = false;
    });

    if (this.modalContent) {
      this.modalContent.addEventListener('mousedown', e => {
        this.isFormInteraction = true;
        this.mouseDownOnOverlay = false;
        e.stopPropagation();
      });

      this.modalContent.addEventListener('click', e => {
        e.stopPropagation();
      });
    }

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    this.form?.addEventListener('submit', e => this.handleSubmit(e));
  }

  setupFormValidation() {
    if (!this.form) return;

    const inputs = this.form.querySelectorAll('input, textarea');

    inputs.forEach(input => {
      input.addEventListener('input', e => {
        this.handleInputFormatting(e);
        this.validateField(input);
      });

      input.addEventListener('blur', () => this.validateField(input));

      input.addEventListener('focus', () => {
        this.hideFieldError(input);
        this.isFormInteraction = true;
      });

      input.addEventListener('mousedown', e => {
        this.isFormInteraction = true;
        this.mouseDownOnOverlay = false;
        e.stopPropagation();
      });
    });
  }

  handleInputFormatting(event) {
    const input = event.target;
    const cursorPosition = input.selectionStart;
    let value = input.value;

    if (input.type === 'text' || input.tagName === 'TEXTAREA') {
      const newValue = value.replace(/\s{2,}/g, ' ');

      if (newValue !== value) {
        input.value = newValue;
        const removedSpaces = value.length - newValue.length;
        input.setSelectionRange(
          Math.max(0, cursorPosition - removedSpaces),
          Math.max(0, cursorPosition - removedSpaces)
        );
      }
    }

    if (input.type === 'email') {
      const newValue = value.replace(/\s/g, '');
      if (newValue !== value) {
        input.value = newValue;
        input.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
      }
    }
  }

  validateField(field) {
    const errorElement = field.parentNode.querySelector('.contact-modal-error');
    if (!errorElement) return true;

    let isValid = true;
    let errorMessage = '';

    const trimmedValue = field.value.trim();

    if (field.name === 'name') {
      if (!trimmedValue) {
        isValid = false;
        errorMessage = 'Name is required';
      } else if (trimmedValue.length < 2) {
        isValid = false;
        errorMessage = 'Name must be at least 2 characters';
      } else if (trimmedValue.length > 50) {
        isValid = false;
        errorMessage = 'Name must be less than 50 characters';
      } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmedValue)) {
        isValid = false;
        errorMessage =
          'Name can only contain letters, spaces, hyphens and apostrophes';
      }
    }

    if (field.name === 'email') {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!trimmedValue) {
        isValid = false;
        errorMessage = 'Email is required';
      } else if (!emailRegex.test(trimmedValue)) {
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
      field.classList.remove('contact-modal-invalid');
      field.classList.add('contact-modal-valid');
    } else {
      field.classList.remove('contact-modal-valid');
      field.classList.add('contact-modal-invalid');
    }

    return isValid;
  }

  hideFieldError(field) {
    const errorElement = field.parentNode.querySelector('.contact-modal-error');
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
    event.stopPropagation();

    const inputs = this.form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      if (input.type !== 'email') {
        input.value = input.value.trim();
      }
    });

    if (!this.validateForm()) {
      const firstInvalid = this.form.querySelector('.contact-modal-invalid');
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    const submitBtn = this.form.querySelector('button[type="submit"]');
    const originalText = submitBtn?.textContent || 'Register';

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Registering...';
      }

      await this.simulateSubmission();

      this.showSuccess();
    } catch (error) {
      console.error('Registration failed:', error);
      this.showError('Registration failed. Please try again.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
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

  resetForm() {
    if (!this.form) return;

    this.form.reset();

    const fields = this.form.querySelectorAll('input, textarea');
    fields.forEach(field => {
      field.classList.remove('contact-modal-valid', 'contact-modal-invalid');
    });

    const errorElements = this.form.querySelectorAll('.contact-modal-error');
    errorElements.forEach(error => {
      error.textContent = '';
    });

    if (this.successMessage) {
      this.successMessage.style.display = 'none';
    }
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
