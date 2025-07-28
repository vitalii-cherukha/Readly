import { refs } from './refs';
import { getTopBooks, getCategoryList, getBooksByCategory } from './api';
import {
  createGallery,
  createCategory,
  clearGallery,
  clearCategory,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './books-render-functions';

const itemsPerPage = 24;
const itemsPerPageMobile = 10;
let allData = [];
let currentPage = 1;

const renderCategories = async () => {
  try {
    clearCategory();
    const categories = await getCategoryList();
    createCategory(categories.slice(15));
  } catch (error) {
    console.log(error);
  }
};

const renderTopBooks = async () => {
  try {
    clearGallery();
    currentPage = 1;
    showLoader();
    const categories = await getTopBooks();
    const allBooks = categories.flatMap(category => category.books);
    allData = allBooks;
    createGallery(getPageData(currentPage));
    if (currentPage * itemsPerPage < allData.length) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
    }
  } catch (error) {
    console.log(error);
  } finally {
    hideLoader();
  }
};

const onCategoryClick = async e => {
  try {
    showLoader();
    e.preventDefault();
    clearGallery();
    currentPage = 1;
    const searchValue = e.target.textContent.trim();
    const searchQuery = await getBooksByCategory(searchValue);
    allData = searchQuery;
    createGallery(getPageData(currentPage));
    if (currentPage * itemsPerPage < allData.length) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
    }
  } catch (error) {
    console.log(error);
  } finally {
    hideLoader();
  }
};

const onShowMoreClick = async e => {
  try {
    showLoader();
    currentPage++;
    e.target.blur();
    createGallery(getPageData(currentPage));
    showLoadMoreButton();
    if (currentPage * itemsPerPage >= allData.length) {
      hideLoadMoreButton();
    }
    const heightCard =
      refs.galleryList.lastElementChild.getBoundingClientRect().height;

    scrollBy({
      top: heightCard * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    console.log(error);
  } finally {
    hideLoader();
  }
};

const getPageData = page => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return allData.slice(startIndex, endIndex);
};

renderTopBooks();
renderCategories();

refs.categoryList.addEventListener('click', onCategoryClick);
refs.showMoreBtn.addEventListener('click', onShowMoreClick);
