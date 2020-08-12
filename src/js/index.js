/* 
kind of a controller in MVC architecture logic
*/

import Search from "./models/Search";
import * as searchView from "./views/searchView";
import { elements } from "./views/base";

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
    // search for recipes
    await state.search.getResult();
    // render results on UI
    searchView.renderResults(state.search.result);
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});
