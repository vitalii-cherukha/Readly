const openBtn = document.querySelector('.mobile-open-menu-btn');
const closeBtn = document.querySelector('.mobile-menu-close-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileNavLinks = document.querySelectorAll('.mobile-page-menu-link');
const desktopNavLinks = document.querySelectorAll('.page-menu-link');
const body = document.body;

openBtn.addEventListener('click', () => {
  mobileMenu.classList.add('is-open');
  body.classList.add('menu-open');
});

closeBtn.addEventListener('click', () => {
  mobileMenu.classList.remove('is-open');
  body.classList.remove('menu-open');
});

mobileNavLinks.forEach(link => {
  link.addEventListener('click', e => {
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    mobileMenu.classList.remove('is-open');
    body.classList.remove('menu-open');
  });
});

desktopNavLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    setTimeout(() => {
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  });
});
