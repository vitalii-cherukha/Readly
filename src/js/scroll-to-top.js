class ScrollToTop {
  constructor() {
    this.button = document.getElementById('scrollToTop');
    this.scrollThreshold = 300;

    if (this.button) {
      this.init();
    }
  }

  init() {
    window.addEventListener('scroll', () => this.toggleButton());

    this.button.addEventListener('click', () => this.scrollToTop());
  }

  toggleButton() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > this.scrollThreshold) {
      this.button.classList.add('visible');
    } else {
      this.button.classList.remove('visible');
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ScrollToTop();
});
