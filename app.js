import fetch from "./js/fetch.js";

const inputEl = document.querySelector(".input-bar");
const resultListEl = document.querySelector(".result-list");
const searchBtn = document.querySelector(".search-bar-btn");
const searchResultEl = document.querySelector(".result-area");
let currentInputVal;

inputEl.addEventListener("input", async function (e) {
  let currentInput = e.target.value.toLowerCase();
  currentInputVal = currentInput;
  renderSearchResult(currentInput);
});

const renderSearchResult = async function (currentInput) {
  if (currentInput) {
    const tvSearchResults = await fetch.TVShows(currentInput);
    resultListEl.classList.remove("hidden");

    if (tvSearchResults) {
      const resultList = tvSearchResults.map((tv) => {
        return `<li class="dropdown-list">
            <img class="dropdown-tv-image" src="${
              tv.show.image?.medium || "./images/no-image-35x50.png"
            }" alt="${tv.show.name}" width="35px" height="50px">
            <span class="dropdown-tv-name">${tv.show.name}</span>
            <span class="dropdown-tv-raing">${
              tv.show.rating.average || "No"
            }⭐</span>
            </li>`;
      });
      resultListEl.innerHTML = resultList.join("");
      removeSearchResultContent();
      const cardResult = renderResults(tvSearchResults);
      console.log(renderResults(cardResult));
      cardResult.map((result) => {
        searchResultEl.append(result);
      });
    }
  } else {
    removeSearchResultList();
  }
};

// Click the search button
searchBtn.addEventListener("click", function () {
  const value = currentInputVal;
  const url = `http://www.google.com/search?q=${value}`;
  window.open(url, "_blank");
  removeSearchResultList();
});

// Click the result from the dropdown
resultListEl.addEventListener("click", function (e) {
  const resultClicked = e.target.textContent;
  removeSearchResultList();
  console.log(`input value is ${resultClicked}`);
  renderSearchResult(resultClicked);
});

const removeSearchResultList = function () {
  while (resultListEl.firstChild) {
    resultListEl.removeChild(resultListEl.firstChild);
  }
  resultListEl.classList.add("hidden");
};

const removeSearchResultContent = function () {
  while (searchResultEl.firstChild) {
    searchResultEl.removeChild(searchResultEl.firstChild);
  }
};

const renderResults = function (tvSearchResults) {
  const tvShowCardResultEl = tvSearchResults.map((tv) => {
    const tvCard = document.createElement("div");
    tvCard.classList.add("tv-show-card");
    tvCard.style.backgroundImage = `url('${tv.show?.image?.medium || ""}')`;
    const tvName =
      tv.show?.name.length >= 25
        ? tv.show?.name.substring(0, 22) + "..."
        : tv.show?.name;
    const summaryText =
      tv.show?.summary?.length >= 140
        ? tv.show?.summary.substring(0, 137) + "..."
        : tv.show?.summary;
    const html = `
            <div class="tv-show-content">
                 <div class="tv-show-title">${tvName}</div>
            <div class="tv-show-summary">${summaryText}</div>
                <a class="learn-more-btn" href="${tv.show?.officialSite}">Learn More</a>
            </div>
        `;
    tvCard.insertAdjacentHTML("beforeend", html);
    return tvCard;
  });
  return tvShowCardResultEl;
};

document.querySelector("body").addEventListener("click", function (e) {
  if (!e.target.closest(".search-result")) {
    removeSearchResultList();
  }
});
