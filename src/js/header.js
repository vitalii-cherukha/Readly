import { refs } from './refs';
import { initAutoHideHeader } from './auto-hide-header.js';

// Ініціалізуємо логіку фіксованого хедера
// initAutoHideHeader();

// === Мобільне меню ===

refs.openBtn.addEventListener('click', () => {
  refs.mobileMenu.classList.add('is-open');
  refs.body.classList.add('menu-open');
});

refs.closeBtn.addEventListener('click', () => {
  refs.mobileMenu.classList.remove('is-open');
  refs.body.classList.remove('menu-open');
});

refs.mobileNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    refs.mobileMenu.classList.remove('is-open');
    refs.body.classList.remove('menu-open');
  });
});
