/* 
kind of a controller in MVC architecture logic
*/

import Search from "./models/Search";
import * as searchView from "./views/searchView";
import { elements, renederSpinner, clearSpinner } from "./views/base";

/** GLOBAL APP STATE
 * search object
 * current recepie object
 * shopping list object
 * linked recipes
 */
const state = {};

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
    // search for recipes
    await state.search.getResult();
    // render results on UI
    clearSpinner();
    searchView.renderResults(state.search.result);
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
