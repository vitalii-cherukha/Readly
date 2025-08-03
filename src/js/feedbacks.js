//refs.feedbacksContainerEl.insertAdjacentHTML(
//  'beforeend','<p>feedbacks.js section</p>');

import { refs } from './refs';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { feedbackData } from './feedbackData';
import { renderAvatar } from './avatar-render';

renderAvatar('alex dulit');

const customAvatars = [
  '/img/feedbacks/avatar-jane.jpg',
  '/img/feedbacks/avatar-john.jpg',
];

const feedbackList = document.querySelector('.feedback-list');

feedbackData.forEach((feedback, index) => {
  const li = document.createElement('li');
  li.classList.add('swiper-slide', 'feedback-item');

  // Вибираємо аватар: перші два — зі свого масиву, інші — з feedbackData
  // const avatarSrc = index < 2 ? customAvatars[index] : feedback.avatar;

  const fullName = `${feedback.firstName} ${feedback.lastName}`;
  const avatarHtml =
    feedback.avatar.trim() !== ''
      ? `<img src="${feedback.avatar}" alt="${fullName}" class="avatar" loading="lazy" />`
      : renderAvatar(feedback.firstName, feedback.lastName);

  li.innerHTML = `
    <div class="feedback-card">
      <p class="quote">"${feedback.text}"</p>
      <div class="author">
        ${avatarHtml}
        <div>
          <p class="name">${fullName}</p>
          <p class="role">${feedback.role}</p>
        </div>
      </div>
    </div>
  `;
  feedbackList.appendChild(li);
});

const swiper = new Swiper('.feedback-swiper', {
  modules: [Navigation, Pagination],

  spaceBetween: 24,
  slidesPerView: 1,
  slidesPerGroup: 1,
  allowTouchMove: true,
  navigation: {
    nextEl: '.next-btn',
    prevEl: '.prev-btn',
  },
  keyboard: { enabled: true },
  a11y: true,
  breakpoints: {
    0: {
      slidesPerView: 1,
      slidesPerGroup: 1,
      spaceBetween: 0, // або 16 для легкого відступу
    },
    768: {
      slidesPerView: 2,
      slidesPerGroup: 1,
      spaceBetween: 24,
    },
    1440: {
      slidesPerView: 3,
      slidesPerGroup: 1,
      spaceBetween: 24,
    },
  },
  on: {
    init: () => updateActiveDot(0),
    slideChange: () => {
      const groupIndex = Math.floor(
        swiper.activeIndex / swiper.params.slidesPerGroup
      );
      updateActiveDot(groupIndex);
    },
  },
});

document.querySelectorAll('.dot').forEach((dot, i) => {
  dot.addEventListener('click', () => {
    swiper.slideTo(i * swiper.params.slidesPerGroup);
  });
});

function updateActiveDot(activeIndex) {
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === activeIndex);
  });
}
