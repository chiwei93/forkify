import 'regenerator-runtime/runtime';
import 'core-js/stable';
//importing all the export in model.js
import * as model from './model.js';

//importing from view.js
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

//importing from config
import { MODAL_CLOSE_SEC } from './config.js';

//for polyfilling everything else

//so parcel will not reload the whole page each time we update the code
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    //to get the hash in the url (window.location = url)
    const id = window.location.hash.slice(1);

    //check for if there is an id
    if (!id) return;

    //render spinner when loading recipe
    recipeView.renderSpinner();

    //step 0 - change the background of the result selected in the result list
    resultsView.update(model.getSearchResultsPage());

    //step 1 - update the bookmark if the bookmark is selected on a specific recipe
    bookmarksView.update(model.state.bookmarks);

    //step 2 - loading the recipe (since loadRecipe is a async function it will return a promise so we need to use await)
    //this is where one async function call another async function
    await model.loadRecipe(id);

    //Step 3 - rendering the whole recipe view
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //step 1 - get query from the input field
    const query = searchView.getQuery();

    //check if there is any input
    if (!query) return;

    //step 2 - load the search results
    await model.loadSearchResults(query);

    //step 3 - render search results
    resultsView.render(model.getSearchResultsPage());

    //step 4 - render the initial pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  //when the btn is click

  //step 1 - render the new results on goto page
  resultsView.render(model.getSearchResultsPage(goToPage));

  //step 2 - render the correct pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipe serving in the state object
  model.updateServings(newServings);
  //update the recipe view (will just re-render the recipe view again)
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //if the recipe haven't been bookmarked, add bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  //if the recipe have been bookmarked, remove bookmark
  else model.deleteBookmark(model.state.recipe.id);

  //rendering the updated recipe view
  recipeView.update(model.state.recipe);

  //render the bookmarkView
  bookmarksView.render(model.state.bookmarks);
};

//function for loading bookmarks from the page load
const controlBookmarks = function () {
  //the bookmark will immediately render from the local storage when the page is load
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //render spinner
    addRecipeView.renderSpinner();

    //upload the new recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render this recipe
    recipeView.render(model.state.recipe);

    //displaying success message
    addRecipeView.renderMessage();

    //re-render the bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change the ID in the url
    //.pushState - allow us to change the url without reloading the page
    //take in three arguments: 1) state 2) title 3)url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

//for adding event handler
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
