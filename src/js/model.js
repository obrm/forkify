import { API_URL, RES_PER_PAGE, API_KEY } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const creatRecipeObject = data => {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    // Trick to conditionally add properties to an object
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async id => {
  try {
    const data = await AJAX(`${API_URL}${id}`);
    state.recipe = creatRecipeObject(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async query => {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}`);
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = (page = state.search.page) => {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = newServings => {
  state.recipe.ingredients.forEach(ingredient => {
    ingredient.quantity =
      (ingredient.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = () => {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = recipe => {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const removeBookmark = id => {
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);
  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = () => {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

const clearBookmarks = () => {
  localStorage.clear('bookmarks');
};

// ////////// Code not implemented /////////////
// export const uploadRecipe = async newRecipe => {
//   try {
//     const ingredients = Object.entries(newRecipe)
//       .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
//       .map(ingredient => {
//         const ingArr = ingredient[1].replaceAll(' ', '').split(',');

//         if (ingArr.length !== 3)
//           throw new Error(
//             'Wrong ingredient format!<br/> Please use the correct format.'
//           );

//         const [quantity, unit, description] = ingArr;
//         return {
//           quantity: quantity ? +quantity : null,
//           unit,
//           description,
//         };
//       });

//     const recipe = {
//       title: newRecipe.title,
//       source_url: newRecipe.sourceUrl,
//       image_url: newRecipe.image,
//       publisher: newRecipe.publisher,
//       cooking_time: +newRecipe.cookingTime,
//       servings: +newRecipe.servings,
//       ingredients,
//     };

//     const data = await sendJSON(`${API_URL}?key=${API_KEY}`, recipe);

//     state.recipe = creatRecipeObject(data);

//     addBookmark(state.recipe);
//   } catch (err) {
//     throw err;
//   }
// };

// clearBookmarks();
init();
