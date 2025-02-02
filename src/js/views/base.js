// all elements that we need on the DOM
export const elements = {
  searchInput: document.querySelector(".search__field"),
  searchForm: document.querySelector(".search"),
  searchResultList: document.querySelector(".results__list"),
  searchResult: document.querySelector(".results"),
  searchResultPages: document.querySelector(".results__pages"),
  recipe: document.querySelector(".recipe"),
  shopping: document.querySelector(".shopping__list"),
  likesMenu: document.querySelector(".likes__field"),
  likesList: document.querySelector(".likes__list"),
};

export const elementStrings = {
  spinner: "loader",
};

// spinner when some data is loading
export const renederSpinner = (parent) => {
  const loader = `
      <div class="${elementStrings.spinner}">
          <svg> 
              <use href="img/icons.svg#icon-cw"></use>
          </svg>
      </div>
      `;
  parent.insertAdjacentHTML("afterbegin", loader);
};

export const clearSpinner = () => {
  const spinner = document.querySelector(`.${elementStrings.spinner}`);
  if (spinner) spinner.parentElement.removeChild(spinner);
};
