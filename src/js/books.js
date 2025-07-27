import { refs } from './refs';
import { getTopBooks, getCategoryList } from './api';
import { createGallery, createCategory } from './books-render-functions';

const renderCategories = async () => {
  try {
    const categories = await getCategoryList();
    createCategory(categories);
  } catch (error) {
    console.log(error);
  }
};

const renderTopBooks = async () => {
  try {
    const categories = await getTopBooks();
    const allBooks = categories.flatMap(category => category.books);
    createGallery(allBooks.slice(15 - 23));
  } catch (error) {
    console.log(error);
  }
};

renderTopBooks();
renderCategories();

const onCategoryClick = e => {
  e.preventDefault();
  console.log(e);
};

refs.categoryList.addEventListener('click', onCategoryClick);
