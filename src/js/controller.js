import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './config.js';
import favicon from '../img/favicon.png';
import logo from '../img/logo.png';

// https://forkify-api.herokuapp.com/v2

const path =
  // 'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bca57';
  'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886';

// if (module.hot) {
//   module.hot.accept();
// }

async function controlRecipes() {
  try {
    // Slice to remove # in the url
    const id = window.location.hash.slice(1);

    // Return when no hash / First loaded without any clicks
    if (!id) return;

    // Render Spinner
    recipeView.renderSpinner();

    // Highlight the selected Recipe
    resultsView.update(model.getSearchResultsPage());

    // Highlight the current recipe in the bookmarks
    bookmarksView.update(model.state.bookmarks);

    // Loading Recipe to the database
    await model.loadRecipe(id);

    // Render Recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    console.error(error);
    recipeView.renderError();
  }
}

async function controlSearchResults() {
  try {
    resultsView.renderSpinner();
    // Get the text in the search field
    const query = searchView.getQuery();
    // Return if there is no query
    if (!query) return;

    // Fetch the results and save it to database
    await model.loadSearchResults(query);
    // Render the page with certain results
    resultsView.render(model.getSearchResultsPage());
    // Render Pagination Buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
}

function controlPagination(gotoPage) {
  // Render New results
  resultsView.render(model.getSearchResultsPage(gotoPage));
  // Render Pagination Buttons
  paginationView.render(model.state.search);
}

function controlServings(newServings) {
  // Update the recipe the servings (in state)
  model.updateServings(newServings);
  // Update the recipe View
  // recipeView.render(model.state.recipe);

  // Update method will only update text and attribute
  recipeView.update(model.state.recipe);
}

// Add bookmark
function controlAddBookmark() {
  // 1) Add or remove bookmarks
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.removeBookmark(model.state.recipe);
  }

  // Update recipe view
  // Update method will only update text and attribute
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

// create bookmark at first
function controlBookmarks() {
  bookmarksView.render(model.state.bookmarks);
}

async function controlAddRecipe(newRecipe) {
  console.log(newRecipe);

  // Upload the new Recipe Data
  try {
    // Show the loading Spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render Recipe
    recipeView.render(model.state.recipe);

    // Render successful message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in the url using hisotry api
    // Use the pushState methods in the history api
    // Takes 3 arguments: states, title, url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Previous page using history api
    // window.history.back();

    // Close form
    setTimeout(() => {
      addRecipeView.removeWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error.message);
  }
}

// Add event listener, but pass them in by methods and activate the listener in the view instead of controller
function init() {
  // Bookmarks view should go first
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServing(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerRender(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();
// // When clicked the a, the hash value of the link will changed
// window.addEventListener('hashchange', getRecipe)
