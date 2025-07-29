import Swiper from 'swiper/bundle';

const swiper = new Swiper('.event-list', {
  direction: 'horizontal',
  slidesPerView: 1,
  spaceBetween: 24,
  keyboard: {
    enabled: true,
    onlyInViewport: true,
  },
  navigation: {
    nextEl: '.js-events-slider-forward',
    prevEl: '.js-events-slider-prev',
  },
  pagination: {
    el: '.events-pagination',
    clickable: true,
  },
  a11y: {
    enabled: true,
    slideRole: '',
  },
  breakpoints: {
    768: {
      slidesPerView: 2,
      spaceBetween: 24,
    },
  },
});
