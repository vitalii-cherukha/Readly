import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const heroSwiper = new Swiper('.hero-swiper', {
  modules: [Navigation, Pagination, Autoplay],
  loop: true,

  navigation: {
    nextEl: '.hero-swiper-btn-next', 
    prevEl: '.hero-swiper-btn-prev',
  },

  grabCursor: true, 
   
  keyboard: {
    enabled: true, 
    onlyInViewport: true, 
  },

  pagination: {
    el: '.hero-swiper-pagination',
    clickable: true,
  },

  speed: 800,
  
  autoplay: {
  delay: 3000, 
  disableOnInteraction: false,
}
});
