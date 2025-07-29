import { refs } from './refs';
import { getTopBooks, getCategoryList, getBooksByCategory } from './api';
import {
  createGallery,
  createCategory,
  renderCounter,
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

const getTotalNow = () => {
  const total = currentPage * itemsPerPage;
  return total > allData.length ? allData.length : total;
};

const renderCategories = async () => {
  try {
    clearCategory();
    const categories = await getCategoryList();
    createCategory(categories);
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
    renderCounter(getTotalNow(), allBooks.length);
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
    renderCounter(getTotalNow(), allData.length);
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
    renderCounter(getTotalNow(), allData.length);
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

const onOpenDropdownClick = e => {
  refs.dropdownMenu.classList.toggle('is-hidden');
};

const onCategoryDropdownClick = async e => {
  try {
    refs.dropdownMenu.classList.add('is-hidden');
    showLoader();
    e.preventDefault();
    clearGallery();
    currentPage = 1;
    const searchValue = e.target.textContent.trim();
    const searchQuery = await getBooksByCategory(searchValue);
    allData = searchQuery;
    createGallery(getPageData(currentPage));
    renderCounter(getTotalNow(), allData.length);

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
  // if (e.target) {
  //   refs.dropdownMenu.classList.add('is-hidden');
  // }
};

renderTopBooks();
renderCategories();

refs.categoryList.addEventListener('click', onCategoryClick);
refs.showMoreBtn.addEventListener('click', onShowMoreClick);
refs.dropdownToggle.addEventListener('click', onOpenDropdownClick);
refs.dropdownMenu.addEventListener('click', onCategoryDropdownClick);
