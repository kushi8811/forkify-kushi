import * as model from './model.js';

import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime';
import { async } from 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2
// if (module.hot) {
//   module.hot.accept();
// }
///////////////////////////////////////

////API CALL (get recipe)
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpiner();

    //0) Update results view to mark selected serach result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    //1) Loading Recipe
    await model.loadRecipe(id); //This is the data we exported from module.js

    //2)Rendering Recipe
    recipeView.render(model.state.recipe);

    // same data u got from load recipe
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    //1) Get Search Query
    const query = searchView.getQuery();
    if (!query) return;
    //2) Load search result
    await model.loadSearchResults(query);

    //3) render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage(1));

    //4) Render intial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlPagination = function (goToPage) {
  //1)Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2) Render new pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipse servings(data)
  model.updateServings(newServings);

  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  //1) Add/Remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  //2) Update recipe view
  recipeView.update(model.state.recipe);
  //3) Render bookmark
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    //Show Loading spinner
    addRecipeView.renderSpiner();
    //Upload the new recipe data (newRecipe)
    await model.uploadRecipe(newRecipe);

    //Render Recipe
    recipeView.render(model.state.recipe);

    //Succes Message
    addRecipeView.renderMessage();

    //Render Bookmark View
    bookmarksView.render(model.state.bookmarks);

    //Change ID in URL (History API) change url without reloading pag
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back()

    //Close Form Window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, 2500);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  //////////Publisher
  bookmarksView.addHandlerRender(controlBookmarks); //Show Bookmarked recipe
  recipeView.addHandlerRender(controlRecipes); //Show Main Recipe
  recipeView.addHandlerUpdateServings(controlServings); // Update serving
  recipeView.addHandlerAddBookmark(controlAddBookmark); //add current recipe as bookmark
  searchView.addHandlerSearch(controlSearchResults); //Render Search Results
  paginationView.addHandlerClick(controlPagination); // Pagination view render button
  addRecipeView.addHandlerUpload(controlAddRecipe); //Add New Recipe
};
init();
