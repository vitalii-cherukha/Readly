import axios from 'axios';

export async function getCategoryList() {
  const ENDPOINT = 'https://books-backend.p.goit.global/books/category-list';

  try {
    const respData = await axios.get(ENDPOINT);
    return respData.data;
  } catch (err) {
    throw err;
  }
}

export const getTopBooks = async () => {
  const ENDPOINT = 'https://books-backend.p.goit.global/books/top-books';
  const response = await axios.get(ENDPOINT);
  return response.data;
};

export async function getBooksByCategory(category) {
  const ENDPOINT = 'https://books-backend.p.goit.global/books/category';
  const queryParams = new URLSearchParams({
    category: category,
  });

  try {
    const respData = await axios.get(`${ENDPOINT}?${queryParams}`);
    return respData.data;
  } catch (err) {
    throw err;
  }
}

export async function getBooksById(id) {
  const ENDPOINT = 'https://books-backend.p.goit.global/books/';

  try {
    const respData = await axios.get(`${ENDPOINT}${id}`);
    return respData;
  } catch (err) {
    throw err;
  }
}
