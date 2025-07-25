import axios from 'axios';

//--- Returns the promise with the list of categories --> Use async/await, then() and try...catch when calling the function
export async function getCategoryList() {
  const ENDPOINT = 'https://books-backend.p.goit.global/books/category-list';

  try {
    const respData = await axios.get(ENDPOINT);
    return respData.data;
  } catch (err) {
    throw err;
  }
}

//--- Example of getting data ---

// import { getCategoryList } from './js/api.js';
// async function testData() {
//   try {
//     const categoryList = await getCategoryList().then(response =>
//       console.log(response)
//     );
//     return categoryList;
//   } catch (err) {
//     console.log(err);
//   }
// }
// testData();

//========================================================================

// --- Retuns the top 5 books from each category
// export async function getTopBooks() {
//   const ENDPOINT = 'https://books-backend.p.goit.global/books/top-books';

//   try {
//     const respData = await axios.get(ENDPOINT);
//     return respData.data;
//   } catch (err) {
//     throw err;
//   }
// }

export const getTopBooks = async () => {
  const ENDPOINT = 'https://books-backend.p.goit.global/books/top-books';
  const response = await axios.get(ENDPOINT);
  return response.data;
};

//--- Example of getting data ---
// import { getTopBooks } from './js/api.js';
// async function testData() {
//   try {
//     const topBooks = await getTopBooks().then(response =>
//       console.log(response)
//     );
//     return topBooks;
//   } catch (err) {
//     console.log(err);
//   }
// }
// testData();

//========================================================================

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

//--- Example of getting data ---
// import { getBooksByCategory } from './js/api.js';
// async function testData() {
//   try {
//     const booksByCat = await getBooksByCategory('Hardcover Nonfiction').then(
//       response => console.log(response)
//     );
//   } catch (err) {
//     err => console.log(err);
//   }
// }
// testData();

export async function getBooksById(id) {
  const ENDPOINT = 'https://books-backend.p.goit.global/books/';

  try {
    const respData = await axios.get(`${ENDPOINT}${id}`);
    return respData;
  } catch (err) {
    throw err;
  }
}
