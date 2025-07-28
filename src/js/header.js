import { refs } from './refs';

refs.openBtn.addEventListener('click', () => {
  refs.mobileMenu.classList.add('is-open');
  refs.body.classList.add('menu-open');
});

refs.closeBtn.addEventListener('click', () => {
  refs.mobileMenu.classList.remove('is-open');
  refs.body.classList.remove('menu-open');
});

let headerHeight = refs.header.offsetHeight;

console.log('before:', headerHeight);

window.addEventListener('resize', () => {
  headerHeight = refs.header.offsetHeight;
  console.log('after:', headerHeight);
});

function scrollToSection(targetId) {
  const targetSection = document.querySelector(targetId);
  if (targetSection) {
    const sectionTop = targetSection.offsetTop - headerHeight;
    window.scrollTo({ top: sectionTop, behavior: 'smooth' });
  }
}

refs.mobileNavLinks.forEach(link => {
  link.addEventListener('click', e => {
    const targetId = link.getAttribute('href');
    scrollToSection(targetId);
    refs.mobileMenu.classList.remove('is-open');
    refs.body.classList.remove('menu-open');
  });
});

refs.desktopNavLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    scrollToSection(targetId);
  });
});

let lastScrollY = window.pageYOffset;
window.addEventListener('scroll', () => {
  const currentScrollY = window.pageYOffset;

  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    refs.header.classList.add('hide-on-scroll');
  } else {
    refs.header.classList.remove('hide-on-scroll');
  }

  lastScrollY = currentScrollY;
});

if (refs.heroSection) {
  refs.heroSection.style.paddingTop = `${headerHeight}px`;
}
