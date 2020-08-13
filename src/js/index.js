/* 
kind of a controller in MVC architecture logic
*/

import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renederSpinner, clearSpinner } from "./views/base";

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
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (e) {
      console.log(e);
    }
  }
};

// multiple events with same callback
["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);

/* LIST CONTROLLER */
const controlList = () => {
  // create a new list if there is not list
  if (!state.list) state.list = new List();
  // add ingredient to the list and in UI
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

// handle delete and update list item events
elements.shopping.addEventListener("click", (e) => {
  const id = e.target.closest(".shopping__item").dataset.itemid;

  // handle delete action
  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    // delete from state
    state.list.deleteItem(id);
    // delete from UI
    listView.deleteItem(id);
    // handle update
  } else if (e.target.matches(".shopping__count-value")) {
    const value = parseFloat(e.target.value, 10);
    state.list.updateCount(id, value);
  }
});

/* LIKE CONTROLLER */
const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentId = state.recipe.id;

  // user has not yet liked current recipe
  if (!state.likes.isLiked(currentId)) {
    // add like to state
    const newLike = state.likes.addLike(
      currentId,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    // toggle the like button
    likesView.toggleLikeBtn(true);
    // add like to UI list
    likesView.renderLike(newLike);
    // user has liked
  } else {
    // remove like from the state
    state, likes.deleteLike(currentId);
    // toggle the like button
    likesView.toggleLikeBtn(false);
    // remove like from UI
    likesView.delelteLike(currentId);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// restore like recipes on page load
window.addEventListener("load", () => {
  state.likes = new Likes();
  // restore likes
  state.likes.readStorage();
  // toggle like menu
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  // render the existing likes
  state.likes.likes.forEach((like) => likesView.renderLike(like));
});

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
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    // add ingredients to the shopping list
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    // like controller
    controlLike();
  }
});
