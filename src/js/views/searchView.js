import { elements } from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = "";
};

export const clearResults = () => {
  elements.searchResultList.innerHTML = "";
  elements.searchResultPages.innerHTML = "";
};

export const highlightedSelected = (id) => {
  const resultsArr = Array.from(document.querySelectorAll(".results__link"));
  resultsArr.forEach((el) => {
    el.classList.remove("results__link--active");
  });
  document
    .querySelector(`.results__link[href="#${id}"]`)
    .classList.add("results__link--active");
};

export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(" ").reduce((acc, cur) => {
      const combined = acc + cur.length;
      if (combined <= limit) {
        newTitle.push(cur);
      }
      return combined;
    }, 0);
    return `${newTitle.join(" ")} ...`;
  }

  return title;
};

const renderRecipe = (recipe) => {
  const markup = `
    <li>
        <a class="results__link results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="Test">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
  elements.searchResultList.insertAdjacentHTML("beforeend", markup);
};
// type: 'prev', 'next'
const createButton = (pageNum, type) => `
    <button class="btn-inline results__btn--${type}" 
            data-goto=${type === "prev" ? pageNum - 1 : pageNum + 1}>
        <span> Page ${type === "prev" ? pageNum - 1 : pageNum + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${
              type === "prev" ? "left" : "right"
            }"></use>
        </svg>
    </button>
`;

const renederButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);
  let button;
  if (page === 1 && pages > 1) {
    button = createButton(page, "next");
  } else if (page < pages) {
    button = `${createButton(page, "prev")}
              ${createButton(page, "next")}`;
  } else if (page === pages && pages > 1) {
    button = createButton(page, "prev");
  }
  elements.searchResultPages.insertAdjacentHTML("afterbegin", button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  recipes.slice(start, end).forEach(renderRecipe);

  renederButtons(page, recipes.length, resPerPage);
};
