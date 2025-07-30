import Swiper from 'swiper/bundle';

let swiper;
const eventList = document.querySelector('.event-list');

function initSwiper() {
  if (window.innerWidth < 1440) {
    eventList.classList.remove('desktop-layout');

    if (!swiper) {
      swiper = new Swiper('.event-list', {
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
    }
  } else {
    eventList.classList.add('desktop-layout');

    if (swiper) {
      swiper.destroy(true, true);
      swiper = null;
    }
  }
}

initSwiper();
window.addEventListener('resize', () => {
  initSwiper();
});
