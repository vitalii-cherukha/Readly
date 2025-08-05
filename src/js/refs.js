export const refs = {
  headerContainerEl: document.querySelector('.header-container'),
  heroContainerEl: document.querySelector('.hero-container'),
  booksContainerEl: document.querySelector('.books-container'),
  feedbacksContainerEl: document.querySelector('.feedbacks-container'),
  eventsContainerEl: document.querySelector('.events-container'),
  contactModalContainerEl: document.querySelector('.contact-modal-container'),
  bookModalContainerEl: document.querySelector('.bm-container'),
  footerContainerEl: document.querySelector('.footer-container'),
  heroSection: document.querySelector('.hero'),

  // === header
  openBtn: document.querySelector('.mobile-open-menu-btn'),
  closeBtn: document.querySelector('.mobile-menu-close-btn'),
  mobileMenu: document.querySelector('.mobile-menu'),
  mobileNavLinks: document.querySelectorAll('.mobile-page-menu-link'),
  desktopNavLinks: document.querySelectorAll('.page-menu-link'),
  header: document.querySelector('.header'),
  body: document.body,

  // === books ===
  galleryList: document.querySelector('.books-gallery-list'),
  categoryList: document.querySelector('.books-nav-category '),
  showMoreBtn: document.querySelector('.books-gallery-btn'),
  loader: document.querySelector('.loader'),
  counter: document.querySelector('.books-nav-counter'),
  dropdownMenu: document.querySelector('.books-dropdown-menu'),
  dropdownToggle: document.querySelector('.books-dropdown-toggle'),
  dropdownToggleText: document.querySelector('.books-dropdown-toggle-text'),

  // === books modal ===
  bookCover: document.querySelector('.bm-cover'),
  titleEl: document.querySelector('.bm-title'),
  authorEl: document.querySelector('.bm-author'),
  priceEl: document.querySelector('.bm-price'),
  modalOverlay: document.querySelector('.bm-overlay'),
  closeButton: document.querySelector('.bm-close'),
  decreaseBtn: document.getElementById('decreaseBtn'),
  increaseBtn: document.getElementById('increaseBtn'),
  quantityInput: document.getElementById('quantity'),
  addToCartBtn: document.querySelector('.bm-add-to-cart'),
  buyNowBtn: document.querySelector('.bm-buy-now'),
  detailsContent: document.querySelectorAll('.ac-panel')[0],
  shippingContent: document.querySelectorAll('.ac-panel')[1],
  returnsContent: document.querySelectorAll('.ac-panel')[2],

  // === feedbacks ===
  feedbackList: document.querySelector('.feedback-list'),
};
