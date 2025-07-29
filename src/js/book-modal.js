import { refs } from './refs';
import { getBooksById } from './api';

/** BOOK MODAL MODULE */

// Функція для відображення модального вікна з інформацією про книгу
export async function showBookModal(bookId) {
  if (!refs.bookModalContainerEl) {
    console.error('❌ Модальне вікно не знайдено! Перевірте refs.bookModalContainerEl');
    return;
  }
  
  try {
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
    if (titleEl) {
      // Перетворюємо назву в правильний формат (кожне слово з великої літери)
      const formattedTitle = book.title
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      titleEl.textContent = formattedTitle;
    }

    const authorEl = document.querySelector('.bm-author');
    if (authorEl) authorEl.textContent = book.author;

    const priceEl = document.querySelector('.bm-price');
    if (priceEl) {
      // Перевіряємо різні можливі ключі для ціни
      let price = book.list_price || book.price || book.amazon_price;
      
      if (!price && book.buy_links && book.buy_links.length > 0) {
        // Якщо є посилання для покупки, ціна може бути там
        const amazonLink = book.buy_links.find(link => link.name === 'Amazon');
        price = amazonLink?.price;
      }
      
      if (price) {
        // Конвертуємо ціну в число і округлюємо до цілого
        const numericPrice = parseFloat(price);
        if (!isNaN(numericPrice)) {
          priceEl.textContent = `$${Math.round(numericPrice)}`;
        } else {
          // Якщо це не число, показуємо як є з доларом
          priceEl.textContent = `$${price}`;
        }
      } else {
        // Якщо ціни немає, показуємо посилання на Amazon або "Ціна уточнюється"
        if (book.amazon_product_url) {
          priceEl.innerHTML = `<a href="${book.amazon_product_url}" target="_blank" style="color: var(--color-bamboo); text-decoration: none;">Переглянути ціну на Amazon</a>`;
        } else {
          priceEl.textContent = 'Ціна уточнюється';
        }
      }
    }

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

    // Додаємо клас is-open до overlay
    const modalOverlay = document.querySelector('.bm-overlay');
    if (modalOverlay) {
      modalOverlay.classList.add('is-open');
    }
    
    // Простіше блокування скролу (як в contact-modal)
    document.body.style.overflow = 'hidden';
    
  } catch (error) {
    console.error('❌ Помилка при завантаженні даних книги:', error);
  }
}

export function closeBookModal() {
  // Видаляємо клас is-open з overlay
  const modalOverlay = document.querySelector('.bm-overlay');
  if (modalOverlay) {
    modalOverlay.classList.remove('is-open');
  }
  
  // Простіше відновлення скролу (як в contact-modal)
  document.body.style.overflow = '';
}

// Обробники подій для accordion
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

// Обробники закриття модального вікна

let mouseDownTarget = null;

refs.bookModalContainerEl.addEventListener('mousedown', (e) => {
  mouseDownTarget = e.target;
});

refs.bookModalContainerEl.addEventListener('mouseup', (e) => {
  // Закриваємо модальне вікно тільки якщо mousedown і mouseup відбулися на overlay
  if (mouseDownTarget === e.target && 
      (e.target === refs.bookModalContainerEl || e.target.classList.contains('bm-overlay'))) {
    closeBookModal();
  }
  mouseDownTarget = null;
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modalOverlay = document.querySelector('.bm-overlay');
    if (modalOverlay && modalOverlay.classList.contains('is-open')) {
      closeBookModal();
    }
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
  decreaseBtn.addEventListener('click', () => {
    let currentValue = parseInt(quantityInput.value) || 1;
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1;
    }
  });

  increaseBtn.addEventListener('click', () => {
    let currentValue = parseInt(quantityInput.value) || 1;
    quantityInput.value = currentValue + 1;
  });

  quantityInput.addEventListener('input', () => {
    let value = parseInt(quantityInput.value);
    if (isNaN(value) || value < 1) {
      quantityInput.value = 1;
    }
  });

  quantityInput.addEventListener('blur', () => {
    let value = parseInt(quantityInput.value);
    if (isNaN(value) || value < 1) {
      quantityInput.value = 1;
    }
  });
}

// Обробники для кнопок "Add To Cart" і "Buy Now"
const addToCartBtn = document.querySelector('.bm-add-to-cart');
const buyNowBtn = document.querySelector('.bm-buy-now');

if (addToCartBtn) {
  addToCartBtn.addEventListener('click', () => {
    const quantity = parseInt(quantityInput.value) || 1;
    const bookTitle = document.querySelector('.bm-title')?.textContent || 'книгу';
    
    // Створюємо і показуємо повідомлення
    showNotification(`Додано до кошика: ${quantity} x "${bookTitle}"`);
  });
}

if (buyNowBtn) {
  buyNowBtn.addEventListener('click', () => {
    showNotification('Дякуємо за покупку!');
    
    // Можна додати затримку перед закриттям модального вікна
    setTimeout(() => {
      closeBookModal();
    }, 1500);
  });
}

// Функція для показу повідомлень
function showNotification(message) {
  // Створюємо елемент повідомлення
  const notification = document.createElement('div');
  notification.className = 'bm-notification';
  notification.textContent = message;
  
  // Додаємо до body
  document.body.appendChild(notification);
  
  // Показуємо з анімацією
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  // Приховуємо через 3 секунди
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Інтеграція з секцією books - автоматичне відкриття модального вікна
window.showBookModal = showBookModal;

// Обробник для кнопок "Learn More"
document.addEventListener('click', (e) => {
  const isLearnMoreBtn = 
    e.target.classList.contains('books-gallery-card-btn') ||
    e.target.textContent?.trim() === 'Learn More' ||
    e.target.innerText?.trim() === 'Learn More' ||
    e.target.closest('button')?.textContent?.trim() === 'Learn More';
  
  if (isLearnMoreBtn) {
    let bookListItem = e.target.closest('li[data-id]') ||
                       e.target.closest('li') ||
                       e.target.closest('[data-id]');
    
    if (bookListItem && bookListItem.dataset.id) {
      e.preventDefault();
      e.stopPropagation();
      showBookModal(bookListItem.dataset.id);
    }
  }
});
