import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
// import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
// import addRecipeView from './views/addRecipeView.js';

const controlRecipes = async () => {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0. Update results and bookmarks view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1. Loading recipe
    await model.loadRecipe(id);

    // 2. Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err + '💥💥');
    recipeView.renderError();
  }
};

const controlSearchResults = async () => {
  try {
    resultsView.renderSpinner();

    // 1. Get search query
    const query = searchView.getQuery();

    if (!query) return;

    // 2. Load search results
    await model.loadSearchResults(query);

    // 3. Render results
    resultsView.render(model.getSearchResultsPage());

    // 4. Render pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err + '💥');
  }
};

const controlPagination = goToPage => {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = newServings => {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = () => {
  // 1. Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  // 2. Update recipe view
  recipeView.update(model.state.recipe);

  // 3. Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = () => {
  bookmarksView.render(model.state.bookmarks);
};

// ////////// Code not implemented /////////////
// const controlAddRecipe = async newRecipe => {
//   try {
//     // Show loading spinner
//     addRecipeView.renderSpinner();

//     // Upload new recipe
//     await model.uploadRecipe(newRecipe);

//     // Display a success message
//     addRecipeView.renderMessage();

//     // Render new recipe
//     recipeView.render(model.state.recipe);
//     setTimeout(() => addRecipeView.toggleWindow(), MODAL_CLOSE_SEC);
//   } catch (err) {
//     addRecipeView.renderError(err.message);
//   }
// };

const init = () => {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPageClick(controlPagination);
  // addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
