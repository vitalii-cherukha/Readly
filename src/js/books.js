import { refs } from './refs';
import { getTopBooks, getCategoryList, getBooksByCategory } from './api';
import {
  createGallery,
  createCategory,
  createCategoryDropdown,
  renderCounter,
  clearGallery,
  clearCategory,
  clearCategoryDropdown,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './books-render-functions';
import iziToast from 'izitoast';

const itemsPerPage = 24;
const itemsPerPageMobile = 10;
let allData = [];
let currentPage = 1;

const getTotalNow = () => {
  if (innerWidth < 768) {
    const total = currentPage * itemsPerPageMobile;
    return total > allData.length ? allData.length : total;
  } else {
    const total = currentPage * itemsPerPage;
    return total > allData.length ? allData.length : total;
  }
};

const onRenderCategories = async e => {
  try {
    const categories = await getCategoryList();
    if (innerWidth < 1440) {
      clearCategoryDropdown();
      createCategoryDropdown(categories.slice(0, 30));
    } else {
      clearCategory();
      createCategory(categories.slice(0, 30));
    }
  } catch (error) {
    iziToast.error({
      message: `Error: ${error}`,
      position: 'topRight',
    });
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
    iziToast.error({
      message: `Error: ${error}`,
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
};

const onCategoryClick = async e => {
  try {
    if (e.target.textContent === 'All categories') {
      renderTopBooks();
    } else {
      showLoader();
      e.preventDefault();
      clearGallery();
      currentPage = 1;
      const searchValue = e.target.textContent.trim();
      const searchQuery = await getBooksByCategory(searchValue);
      allData = searchQuery;
      createGallery(getPageData(currentPage));
      renderCounter(getTotalNow(), allData.length);
    }
    if (currentPage * itemsPerPage < allData.length) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      message: `Error: ${error}`,
      position: 'topRight',
    });
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
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
    const heightCard =
      refs.galleryList.lastElementChild.getBoundingClientRect().height;

    scrollBy({
      top: heightCard * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    iziToast.error({
      message: `Error: ${error}`,
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
};

const getPageData = page => {
  if (innerWidth < 768) {
    const startIndex = (page - 1) * itemsPerPageMobile;
    const endIndex = startIndex + itemsPerPageMobile;
    return allData.slice(startIndex, endIndex);
  } else {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allData.slice(startIndex, endIndex);
  }
};

const onOpenDropdownClick = e => {
  refs.dropdownMenu.classList.toggle('is-hidden');
};

const onCategoryDropdownClick = async e => {
  try {
    refs.dropdownMenu.classList.add('is-hidden');
    if (e.target.textContent === 'All categories') {
      renderTopBooks();
    } else {
      showLoader();
      e.preventDefault();
      clearGallery();
      currentPage = 1;
      const searchValue = e.target.textContent.trim();
      const searchQuery = await getBooksByCategory(searchValue);
      allData = searchQuery;
      createGallery(getPageData(currentPage));
      renderCounter(getTotalNow(), allData.length);
    }

    if (currentPage * itemsPerPage < allData.length) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      message: `Error: ${error}`,
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
};

const onHideDropdownClick = e => {
  const isMenu = refs.dropdownMenu.contains(e.target);
  const isToggle = refs.dropdownToggle.contains(e.target);

  if (!isMenu && !isToggle) {
    refs.dropdownMenu.classList.add('is-hidden');
  }
};

renderTopBooks();
onRenderCategories();

document.addEventListener('click', onHideDropdownClick);
window.addEventListener('resize', onRenderCategories);
refs.categoryList.addEventListener('click', onCategoryClick);
refs.showMoreBtn.addEventListener('click', onShowMoreClick);
refs.dropdownToggle.addEventListener('click', onOpenDropdownClick);
refs.dropdownMenu.addEventListener('click', onCategoryDropdownClick);
