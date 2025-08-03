import { refs } from './refs';
import { getBooksById } from './api';
import Accordion from 'accordion-js';
import iziToast from 'izitoast';

/** BOOK MODAL MODULE */

// Функція для відображення модального вікна з інформацією про книгу
export async function showBookModal(bookId) {
  if (!refs.bookModalContainerEl) {
    iziToast.error({
      title: 'Error!',
      message: 'Modal window not found, check refs.bookModalContainer',
    });
    return;
  }

  try {
    const response = await getBooksById(bookId);
    const book = response.data;

    // Оновлюємо зображення книги
    if (refs.bookCover) {
      refs.bookCover.src = book.book_image;
      refs.bookCover.alt = book.title;
    }

    // Оновлюємо інші дані книги
    if (refs.titleEl) {
      // Перетворюємо назву в правильний формат (кожне слово з великої літери)
      const formattedTitle = book.title
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      refs.titleEl.textContent = formattedTitle;
    }

    if (refs.authorEl) refs.authorEl.textContent = book.author;

    if (refs.priceEl) {
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
          refs.priceEl.textContent = `$${Math.round(numericPrice)}`;
        } else {
          // Якщо це не число, показуємо як є з доларом
          refs.priceEl.textContent = `$${price}`;
        }
      } else {
        // Якщо ціни немає, показуємо посилання на Amazon або "Ціна уточнюється"
        if (book.amazon_product_url) {
          refs.priceEl.innerHTML = `<a href="${book.amazon_product_url}" target="_blank" style="color: var(--color-bamboo); text-decoration: none;">Переглянути ціну на Amazon</a>`;
        } else {
          refs.priceEl.textContent = 'Ціна уточнюється';
        }
      }
    }

    if (refs.detailsContent) {
      const detailsHTML = `
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Publisher:</strong> ${book.publisher || 'Not specified'}</p>
        <p><strong>Book Category:</strong> ${
          book.list_name || 'Not specified'
        }</p>
        <p><strong>Description:</strong> ${
          book.description || 'No description available'
        }</p>
      `;
      refs.detailsContent.innerHTML = detailsHTML;
    }

    if (refs.shippingContent) {
      refs.shippingContent.innerHTML = `
        <p>Delivery Options:</p>
        <ul>
          <li>Standard Delivery: 3-7 business days</li>
          <li>Express Delivery: 1-3 business days</li>
          <li>Free shipping on orders over $50</li>
        </ul>
        <p>International shipping is available for most countries.</p>
      `;
    }

    if (refs.returnsContent) {
      refs.returnsContent.innerHTML = `
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
    if (refs.modalOverlay) {
      refs.modalOverlay.classList.add('is-open');
    }

    // Простіше блокування скролу (як в contact-modal)
    document.body.style.overflow = 'hidden';

    // Ініціалізуємо accordion після відкриття модального вікна
    setTimeout(() => {
      initializeAccordion();
    }, 100);
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: `Book load error: ${error}`,
    });
  }
}

export function closeBookModal() {
  // Видаляємо клас is-open з overlay
  if (refs.modalOverlay) {
    refs.modalOverlay.classList.remove('is-open');
  }

  // Знищуємо інстанс accordion при закритті модального вікна
  if (accordionInstance) {
    accordionInstance.destroy();
    accordionInstance = null;
  }

  // Простіше відновлення скролу (як в contact-modal)
  document.body.style.overflow = '';
}

// Ініціалізація accordion-js
let accordionInstance = null;

function initializeAccordion() {
  // Знищуємо попередній інстанс, якщо він існує
  if (accordionInstance) {
    accordionInstance.destroy();
  }

  // Створюємо новий інстанс accordion-js
  accordionInstance = new Accordion('.bm-accordion-container', {
    duration: 300,
    ariaEnabled: true,
    collapse: true,
    showMultiple: false,
    onlyChildNodes: true,
    openOnInit: [],
    elementClass: 'ac',
    triggerClass: 'ac-trigger',
    panelClass: 'ac-panel',
    activeClass: 'is-active',
  });
}

// Обробники закриття модального вікна

let mouseDownTarget = null;

refs.bookModalContainerEl.addEventListener('mousedown', e => {
  mouseDownTarget = e.target;
});

refs.bookModalContainerEl.addEventListener('mouseup', e => {
  // Закриваємо модальне вікно тільки якщо mousedown і mouseup відбулися на overlay
  if (
    mouseDownTarget === e.target &&
    (e.target === refs.bookModalContainerEl ||
      e.target.classList.contains('bm-overlay'))
  ) {
    closeBookModal();
  }
  mouseDownTarget = null;
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const modalOverlay = document.querySelector('.bm-overlay');
    if (modalOverlay && modalOverlay.classList.contains('is-open')) {
      closeBookModal();
    }
  }
});

if (refs.closeButton) {
  refs.closeButton.addEventListener('click', closeBookModal);
}

// Обробники для кнопок зміни кількостіc
if (refs.decreaseBtn && refs.increaseBtn && refs.quantityInput) {
  refs.decreaseBtn.addEventListener('click', () => {
    let currentValue = parseInt(refs.quantityInput.value) || 1;
    if (currentValue > 1) {
      refs.quantityInput.value = currentValue - 1;
    }
  });

  refs.increaseBtn.addEventListener('click', () => {
    let currentValue = parseInt(refs.quantityInput.value) || 1;
    refs.quantityInput.value = currentValue + 1;
  });

  refs.quantityInput.addEventListener('input', () => {
    let value = parseInt(refs.quantityInput.value);
    if (isNaN(value) || value < 1) {
      refs.quantityInput.value = 1;
    }
  });

  refs.quantityInput.addEventListener('blur', () => {
    let value = parseInt(refs.quantityInput.value);
    if (isNaN(value) || value < 1) {
      refs.quantityInput.value = 1;
    }
  });
}

// Обробники для кнопок "Add To Cart" і "Buy Now"
if (refs.addToCartBtn) {
  refs.addToCartBtn.addEventListener('click', e => {
    e.preventDefault();
    const quantity = parseInt(refs.quantityInput.value) || 1;
    const bookTitleText = refs.bookTitle.textContent;

    // const bookTitle =
    //   document.querySelector('.bm-title')?.textContent || 'книгу';

    // Показуємо стандартне браузерне повідомлення
    iziToast.success({
      message: `${quantity}x of "${bookTitleText}" added to cart `,
      position: 'topRight',
    });
  });
}

if (refs.buyNowBtn) {
  refs.buyNowBtn.addEventListener('click', e => {
    e.preventDefault();
    iziToast.success({
      message: 'Thank you for the purchase',
      position: 'topRight',
    });

    // Закриваємо модальне вікно відразу після повідомлення
    closeBookModal();
  });
}

// Інтеграція з секцією books - автоматичне відкриття модального вікна
window.showBookModal = showBookModal;

// Обробник для кнопок "Learn More"
document.addEventListener('click', e => {
  const isLearnMoreBtn =
    e.target.classList.contains('books-gallery-card-btn') ||
    e.target.textContent?.trim() === 'Learn More' ||
    e.target.innerText?.trim() === 'Learn More' ||
    e.target.closest('button')?.textContent?.trim() === 'Learn More';

  if (isLearnMoreBtn) {
    let bookListItem =
      e.target.closest('li[data-id]') ||
      e.target.closest('li') ||
      e.target.closest('[data-id]');

    if (bookListItem && bookListItem.dataset.id) {
      e.preventDefault();
      e.stopPropagation();
      showBookModal(bookListItem.dataset.id);
    }
  }
});
