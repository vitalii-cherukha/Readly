import { refs } from './refs';
import { getBooksById } from './api';

// Функція для відображення модального вікна з інформацією про книгу
export async function showBookModal(bookId) {
  try {
    // Зберігаємо поточну позицію скрола
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    // Встановлюємо CSS змінні для коректного приховання скрола
    document.documentElement.style.setProperty('--scroll-top', `-${scrollTop}px`);
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    
    const response = await getBooksById(bookId);
    const book = response.data;
    
    // Оновлюємо зображення книги
    const bookCover = document.querySelector('.bm-cover');
    if (bookCover) {
      bookCover.src = book.book_image;
      bookCover.alt = book.title;
    }

    // Оновлюємо інші дані книги
    const titleEl = document.querySelector('.bm-title');
    if (titleEl) titleEl.textContent = book.title;

    const authorEl = document.querySelector('.bm-author');
    if (authorEl) authorEl.textContent = book.author;

    const priceEl = document.querySelector('.bm-price');
    if (priceEl) priceEl.textContent = book.list_price ? `$${book.list_price}` : 'Price not available';

    const detailsContent = document.getElementById('details');
    if (detailsContent) {
      const detailsHTML = `
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Publisher:</strong> ${book.publisher || 'Not specified'}</p>
        <p><strong>Book Category:</strong> ${book.list_name || 'Not specified'}</p>
        <p><strong>Description:</strong> ${book.description || 'No description available'}</p>
      `;
      detailsContent.innerHTML = detailsHTML;
    }

    const shippingContent = document.getElementById('shipping');
    if (shippingContent) {
      shippingContent.innerHTML = `
        <p>Delivery Options:</p>
        <ul>
          <li>Standard Delivery: 3-7 business days</li>
          <li>Express Delivery: 1-3 business days</li>
          <li>Free shipping on orders over $50</li>
        </ul>
        <p>International shipping is available for most countries.</p>
      `;
    }

    const returnsContent = document.getElementById('returns');
    if (returnsContent) {
      returnsContent.innerHTML = `
        <p>Return Policy:</p>
        <ul>
          <li>30-day return window</li>
          <li>Book must be in original condition</li>
          <li>Return shipping costs may apply</li>
          <li>Digital products are non-refundable</li>
        </ul>
        <p>Please contact customer service for more details about returns and refunds.</p>
      `;
    }

    refs.bookModalContainerEl.classList.add('is-open');
    document.body.classList.add('modal-open');
    document.documentElement.classList.add('modal-open');
  } catch (error) {
    console.error('Error fetching book details:', error);
  }
}

export function closeBookModal() {
  // Отримуємо збережену позицію скрола
  const scrollTop = getComputedStyle(document.documentElement).getPropertyValue('--scroll-top');
  
  refs.bookModalContainerEl.classList.remove('is-open');
  document.body.classList.remove('modal-open');
  document.documentElement.classList.remove('modal-open');
  
  // Очищаємо CSS змінні
  document.documentElement.style.removeProperty('--scroll-top');
  document.documentElement.style.removeProperty('--scrollbar-width');
  
  // Відновлюємо позицію скрола
  if (scrollTop) {
    window.scrollTo(0, parseInt(scrollTop.replace('-', '').replace('px', '')));
  }
}

const accordionButtons = document.querySelectorAll('.bm-accordion-header');

accordionButtons.forEach(button => {
  button.addEventListener('click', () => {

    const targetId = button.getAttribute('data-target');
    const content = document.getElementById(targetId);
    
    const isActive = content.classList.contains('active');
    
    if (isActive) {

      content.style.height = content.scrollHeight + 'px';

      content.offsetHeight;
      content.style.height = '0';
      content.classList.remove('active');
      button.setAttribute('aria-expanded', 'false');
    } else {

      content.classList.add('active');
      content.style.height = content.scrollHeight + 'px';
      button.setAttribute('aria-expanded', 'true');
      
      content.addEventListener('transitionend', function handler() {
        if (!content.classList.contains('active')) return;
        content.style.height = 'auto';
        content.removeEventListener('transitionend', handler);
      });
    }
  });
});

refs.bookModalContainerEl.addEventListener('click', (e) => {
  if (e.target === refs.bookModalContainerEl) {
    closeBookModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && refs.bookModalContainerEl.classList.contains('is-open')) {
    closeBookModal();
  }
});

const closeButton = document.querySelector('.bm-close');
if (closeButton) {
  closeButton.addEventListener('click', closeBookModal);
}

// Обробники для кнопок зміни кількості
const decreaseBtn = document.getElementById('decreaseBtn');
const increaseBtn = document.getElementById('increaseBtn');
const quantityInput = document.getElementById('quantity');

if (decreaseBtn && increaseBtn && quantityInput) {
  // Функція для зменшення кількості
  decreaseBtn.addEventListener('click', () => {
    let currentValue = parseInt(quantityInput.value) || 1;
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1;
    }
  });

  // Функція для збільшення кількості
  increaseBtn.addEventListener('click', () => {
    let currentValue = parseInt(quantityInput.value) || 1;
    quantityInput.value = currentValue + 1;
  });

  // Перевірка вводу в поле кількості
  quantityInput.addEventListener('input', () => {
    let value = parseInt(quantityInput.value);
    if (isNaN(value) || value < 1) {
      quantityInput.value = 1;
    }
  });

  // Перевірка при втраті фокуса
  quantityInput.addEventListener('blur', () => {
    let value = parseInt(quantityInput.value);
    if (isNaN(value) || value < 1) {
      quantityInput.value = 1;
    }
  });
}

// ============= ТЕСТОВИЙ КОД =============
// Видалити цей код після інтеграції з основним функціоналом
// Додати виклик showBookModal(bookId) при кліку на книгу в основному списку
// setTimeout(() => {
//   showBookModal('68680e31ac8a51f74dd6a25b');
// }, 1000);
// =======================================
