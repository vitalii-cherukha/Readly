import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { openContactModal } from './contact-modal.js';

class EventsManager {
  constructor() {
    this.eventsSection = document.querySelector('.events');
    this.swiperContainer = document.querySelector('.events-swiper');
    this.swiper = null;

    this.init();
  }

  init() {
    if (!this.eventsSection || !this.swiperContainer) return;

    this.initSwiper();
    this.bindEvents();
  }

  initSwiper() {
    this.swiper = new Swiper('.events-swiper', {
      modules: [Navigation, Pagination, Autoplay],

      slidesPerView: 1,
      spaceBetween: 16,
      centeredSlides: false,

      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 24,
          centeredSlides: false,
        },
        1024: {
          slidesPerView: 2,
          spaceBetween: 24,
          centeredSlides: false,
        },
        1440: {
          slidesPerView: 3,
          spaceBetween: 40,
          centeredSlides: false,
        },
      },

      navigation: {
        nextEl: '.events-swiper-button-next',
        prevEl: '.events-swiper-button-prev',
      },

      pagination: {
        el: '.events-swiper-pagination',
        clickable: true,
        dynamicBullets: false,
        renderBullet: function (index, className) {
          return '<span class="' + className + '"></span>';
        },
      },

      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },

      speed: 600,
      effect: 'slide',
      loop: true,
      touchRatio: 1,
      touchAngle: 45,
      grabCursor: true,

      a11y: {
        prevSlideMessage: 'Previous event',
        nextSlideMessage: 'Next event',
        paginationBulletMessage: 'Go to event {{index}}',
      },

      on: {
        init: () => {
          this.addNavigationIcons();
          this.updateNavigationVisibility();
        },
        resize: () => {
          this.updateNavigationVisibility();
        },
        breakpoint: () => {
          this.updateNavigationVisibility();
        },
      },
    });
  }

  addNavigationIcons() {
    const nextBtn = document.querySelector('.events-swiper-button-next');
    const prevBtn = document.querySelector('.events-swiper-button-prev');

    if (nextBtn) {
      nextBtn.innerHTML = `
        <svg width="24" height="24" aria-hidden="true">
         <use href="img/sprite.svg#icon-right-arrow-alt" style="fill: white"></use>
        </svg>
      `;
      nextBtn.setAttribute('aria-label', 'Наступна подія');
    }

    if (prevBtn) {
      prevBtn.innerHTML = `
        <svg width="24" height="24" aria-hidden="true">
          <use href="img/sprite.svg#icon-left-arrow-alt" style="fill: white"></use>
        </svg>
      `;
      prevBtn.setAttribute('aria-label', 'Попередня подія');
    }
  }

  updateNavigationVisibility() {
    const isDesktop = window.innerWidth >= 1440;
    const nextBtn = document.querySelector('.events-swiper-button-next');
    const prevBtn = document.querySelector('.events-swiper-button-prev');
    const navigationContainer = document.querySelector('.events-navigation');

    if (nextBtn && prevBtn) {
      nextBtn.style.display = isDesktop ? 'none' : 'flex';
      prevBtn.style.display = isDesktop ? 'none' : 'flex';
    }

    if (navigationContainer) {
      navigationContainer.style.display = isDesktop ? 'none' : 'flex';
    }
  }

  bindEvents() {
    this.eventsSection.addEventListener(
      'click',
      this.handleEventClick.bind(this)
    );

    if (window.innerWidth >= 1024) {
      this.swiperContainer.addEventListener('mouseenter', () => {
        if (this.swiper && this.swiper.autoplay) {
          this.swiper.autoplay.stop();
        }
      });

      this.swiperContainer.addEventListener('mouseleave', () => {
        if (this.swiper && this.swiper.autoplay) {
          this.swiper.autoplay.start();
        }
      });
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.updateNavigationVisibility();
      }, 100);
    });
  }

  handleEventClick(event) {
    const registerBtn = event.target.closest('.events-btn');

    if (registerBtn) {
      event.preventDefault();
      const eventName = registerBtn.dataset.event;
      openContactModal(eventName);

      if (this.swiper && this.swiper.autoplay) {
        this.swiper.autoplay.stop();
      }
    }
  }

  nextSlide() {
    if (this.swiper) {
      this.swiper.slideNext();
    }
  }

  prevSlide() {
    if (this.swiper) {
      this.swiper.slidePrev();
    }
  }

  goToSlide(index) {
    if (this.swiper) {
      this.swiper.slideTo(index);
    }
  }

  destroy() {
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = null;
    }
  }
}

let eventsManagerInstance;

document.addEventListener('DOMContentLoaded', () => {
  eventsManagerInstance = new EventsManager();
});

export { eventsManagerInstance };
export default EventsManager;
