import { refs } from './refs';

export const createGallery = books => {
  const galleryCardTemplate = books
    .map(
      book =>
        `<li class="books-gallery-card">
          <img
            class="books-gallery-img"
            src="${book.book_image}"
            alt="${book.description}"
            width="227"
            height="323"
          />
          <div class="books-gallery-card-info">
            <div class="books-galler-card-text">
              <h3 class="books-gallery-card-title">${book.title.toLowerCase()}</h3>
              <p class="books-gallery-card-author">${book.author}</p>
            </div>
            <p class="books-gallery-card-price">$${Math.round(
              Number(book.price)
            )}</p>
          </div>
          <button class="books-gallery-card-btn" type="button">
            Learn More
          </button>
        </li>`
    )
    .join('');
  refs.galleryList.innerHTML = galleryCardTemplate;
};

export const createCategory = list => {
  const categoryItemTemplate = list
    .map(
      item =>
        `<li class="books-nav-category-item">
          <a href="#">${item.category}</a>
        </li>`
    )
    .join('');
  refs.categoryList.innerHTML = categoryItemTemplate;
};
