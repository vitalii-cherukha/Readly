import { refs } from './refs';

let headerHeight = refs.header.offsetHeight;
let lastScrollY = window.pageYOffset;

/**
 * Оновлює висоту хедера при зміні розміру
 */
function updateHeaderHeight() {
  headerHeight = refs.header.offsetHeight;
}

/**
 * Додає padding до першої секції, щоб хедер її не перекривав
 */
function applyHeroOffset() {
  if (refs.heroSection) {
    refs.heroSection.style.paddingTop = `${headerHeight}px`;
  }
}

/**
 * Скролить до секції з урахуванням хедера
 */
function scrollToSection(targetId) {
  const targetSection = document.querySelector(targetId);
  if (targetSection) {
    const sectionTop = targetSection.offsetTop - headerHeight;
    window.scrollTo({ top: sectionTop, behavior: 'smooth' });
  }
}

/**
 * Обробник скролу — ховає/показує хедер
 */
function handleScroll() {
  const currentScrollY = window.pageYOffset;

  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    refs.header.classList.add('hide-on-scroll');
  } else {
    refs.header.classList.remove('hide-on-scroll');
  }

  lastScrollY = currentScrollY;
}

/**
 * Ініціалізує логіку фіксованого хедера
 */
export function initAutoHideHeader() {
  updateHeaderHeight();
  applyHeroOffset();

  window.addEventListener('resize', () => {
    updateHeaderHeight();
    applyHeroOffset();
  });

  window.addEventListener('scroll', handleScroll);

  refs.desktopNavLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      scrollToSection(targetId);
    });
  });

  refs.mobileNavLinks.forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      scrollToSection(targetId);
    });
  });
}
