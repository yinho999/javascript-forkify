'use strict';
import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};
function createRecipeObject(data) {
  let { recipe } = data.data;
  return {
    id: recipe.id,
    cookingTime: recipe.cooking_time,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
}

// Load Recipe
export const loadRecipe = async function (id) {
  try {
    // Loading Recipe data
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    state.bookmarks.some(rec => rec.id === id)
      ? (state.recipe.bookmarked = true)
      : (state.recipe.bookmarked = false);
  } catch (error) {
    throw new Error(error);
  }
};

// Search results render
export async function loadSearchResults(query) {
  try {
    // Loading All Recipes
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.query = query;
    state.search.page = 1;
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        image: recipe.image_url,
        publisher: recipe.publisher,
        title: recipe.title,
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (error) {
    throw new Error(error);
  }
}

// Separated Pages
export function getSearchResultsPage(page = state.search.page) {
  state.search.page = page;
  // Slice the big chunk of data into pages
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
}

// Update Servings
export function updateServings(newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
}

function presistBookMark() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

// Add recipe id to the bookmark in state
export function addBookmark(recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }
  presistBookMark();
}

// Remove recipe id to the bookmark in state
export function removeBookmark(recipe) {
  //remove bookmark
  state.bookmarks.splice(state.bookmarks.indexOf(recipe), 1);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
  presistBookMark();
}

function clearBookmarks() {
  // Clear the item
  localStorage.clear('bookmarks');
}
// clearBookmarks();

function init() {
  const storage = localStorage.getItem('bookmarks');
  if (!storage) return;
  state.bookmarks = JSON.parse(storage);
}
init();

export async function uploadRecipe(newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(el => {
        const [key, value] = el;
        return key.includes('ingredient') && value;
      })
      .map(el => {
        const [key, value] = el;
        const ingredientArray = value.split(',').map(el => el.trim());
        if (ingredientArray.length !== 3) {
          throw new Error(
            'Wrong ingredient format! please use the correct format'
          );
        }
        const [quantity, unit, description] = ingredientArray;
        return {
          quantity: quantity ? +quantity : null,
          unit: unit,
          description: description,
        };
      });
    const recipe = {
      title: newRecipe.title,
      servings: +newRecipe.servings,
      ingredients: ingredients,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      cooking_time: +newRecipe.cookingTime,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
}
