import * as modal from './modal.js';
import recipeView from './views/recipeview.js';
import searchView from './views/searchView.js';
import ResultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookMarkView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import resultView from './views/resultView.js';
import addRecipeView from './views/addRecipeView.js';

// // code from parcel for live change on coding
// if (module.hot) {
//   module.hot.accept();
// }

const recipeContainer = document.querySelector('.recipe');

const controllRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    //gouard clause
    if (!id) return;
    recipeView.renderSpinner();
    //0. update result with active recipe
    resultView.update(modal.getSearchResultsPage());
    bookmarkView.update(modal.state.bookmarks);
    //1. loading recipe
    await modal.loadRecipe(id);

    // 2. rendering recipe
    recipeView.render(modal.state.recipe);
    // temporary checking updateed serving
    // controlServings();
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};
const controlSearchResult = async function () {
  try {
    ResultView.renderSpinner();

    //1. get search query
    const query = searchView.getQuery();
    if (!query) if (!query) return;

    //2. load search result
    await modal.loadSearchResult(query);

    //3.render results
    ResultView.render(modal.getSearchResultsPage(1));

    //4. render initial pagination
    paginationView.render(modal.state.search);
  } catch (err) {
    console.error(err);
  }
};
const controlPagination = function (goToPage) {
  console.log(goToPage);
  //1.render new results
  ResultView.render(modal.getSearchResultsPage(goToPage));

  //2. render new  pagination buttons
  paginationView.render(modal.state.search);
};

// increase decrease serving number feature
const controlServings = function (newServings) {
  modal.updateServings(newServings);
  //rendering recipe with new servings
  recipeView.update(modal.state.recipe);
};

const controlAddBookmark = function () {
  //1. add  or remove bookmark
  if (!modal.state.recipe.bookmarked) modal.addBookMark(modal.state.recipe);
  else modal.deleteBookmark(modal.state.recipe.id);

  //2. update bookmark on recipeview
  recipeView.update(modal.state.recipe);

  //3. render bookmark
  bookmarkView.render(modal.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarkView.render(modal.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    await modal.uploadRecipe(newRecipe);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

// implementing publisher-subscriber pattern
const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controllRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
