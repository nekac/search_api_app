/* 
kind of a controller in MVC architecture logic
*/

import Search from "./models/Search";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import { elements, renederSpinner, clearSpinner } from "./views/base";
import Recipe from "./models/Recipe";

/** GLOBAL APP STATE
 * search object
 * current recepie object
 * shopping list object
 * linked recipes
 */
const state = {};

/* SEARCH CONTROLLER */
const controlSearch = async () => {
  // get query from the view
  const query = searchView.getInput();
  if (query) {
    // new search object and add to state
    state.search = new Search(query);
    // prepare user interface
    searchView.clearInput();
    searchView.clearResults();
    renederSpinner(elements.searchResult);

    try {
      // search for recipes
      await state.search.getResult();
      // render results on UI
      clearSpinner();
      searchView.renderResults(state.search.result);
    } catch (e) {
      console.log(e);
      clearSpinner();
    }
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

elements.searchResultPages.addEventListener("click", (e) => {
  // cosest ancestor of the current element
  const button = e.target.closest(".btn-inline");
  if (button) {
    const goToPage = parseInt(button.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

/* RECIPE CONTROLLER */

const controlRecipe = async () => {
  const id = window.location.hash.replace("#", ""); // id from url
  if (id) {
    // prepare UI for the changes
    recipeView.clearRecepie();
    renederSpinner(elements.recipe);

    // hilight selected search item
    if (state.search) searchView.highlightedSelected(id);

    // create a new recipe object
    state.recipe = new Recipe(id);

    try {
      // get recipe data and parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      // call functions for calculatings
      state.recipe.calcTime();
      state.recipe.calcServings();
      // render the recipe
      clearSpinner();
      recipeView.renderRecipe(state.recipe);
    } catch (e) {
      console.log(e);
    }
  }
};

// multiple events with same callback
["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);

// handling recepie button clicks, delegation
elements.recipe.addEventListener("click", (e) => {
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  }
});
