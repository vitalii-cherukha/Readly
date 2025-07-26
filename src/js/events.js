import Swiper from 'swiper';
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectCoverflow,
} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

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

      // Basic settings
      direction: 'horizontal',
      loop: true,
      centeredSlides: false,

      // Responsive breakpoints
      slidesPerView: 1,
      spaceBetween: 20,

      breakpoints: {
        640: {
          slidesPerView: 1,
          spaceBetween: 24,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 28,
        },
        1024: {
          slidesPerView: 2.5,
          spaceBetween: 32,
        },
        1440: {
          slidesPerView: 3,
          spaceBetween: 40,
        },
      },

      // Navigation
      navigation: {
        nextEl: '.events-swiper-button-next',
        prevEl: '.events-swiper-button-prev',
      },

      // Pagination
      pagination: {
        el: '.events-swiper-pagination',
        clickable: true,
        dynamicBullets: true,
      },

      // Autoplay
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },

      // Effects
      speed: 600,
      effect: 'slide',

      // Accessibility
      a11y: {
        prevSlideMessage: 'Previous event',
        nextSlideMessage: 'Next event',
        paginationBulletMessage: 'Go to event {{index}}',
      },

      // Events
      on: {
        init: () => {
          console.log('Events Swiper initialized');
        },
        slideChange: () => {
          // Optional: track slide changes
        },
      },
    });
  }

  bindEvents() {
    // Register button clicks
    this.eventsSection.addEventListener(
      'click',
      this.handleEventClick.bind(this)
    );

    // Pause autoplay on hover
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

  handleEventClick(event) {
    const registerBtn = event.target.closest('.events-btn');

    if (registerBtn) {
      event.preventDefault();
      const eventName = registerBtn.dataset.event;
      openContactModal(eventName);

      // Optional: pause autoplay when modal opens
      if (this.swiper && this.swiper.autoplay) {
        this.swiper.autoplay.stop();
      }
    }
  }

  // Public methods for external control
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

// Initialize events manager
let eventsManagerInstance;

document.addEventListener('DOMContentLoaded', () => {
  eventsManagerInstance = new EventsManager();
});

// Export for external use
export { eventsManagerInstance };
export default EventsManager;
