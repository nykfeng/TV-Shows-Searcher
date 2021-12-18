import fetch from "./js/fetch.js";

const inputEl = document.querySelector(".input-bar");
const resultListEl = document.querySelector(".result-list");
const searchBtn = document.querySelector(".search-bar-btn");
const searchResultEl = document.querySelector(".result-area");
let currentInputVal;
let notClicked = true;
let tvSearchResults = [];
inputEl.addEventListener("input", async function (e) {
  let currentInput = e.target.value.toLowerCase();
  currentInputVal = currentInput;
  renderSearchResult(currentInput);
});

const renderSearchResult = async function (currentInput) {
  if (currentInput) {
    tvSearchResults = await fetch.TVShows(currentInput);
    resultListEl.classList.remove("hidden");

    if (notClicked) {
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
      } else {
        removeSearchResultList();
      }
    }
    removeSearchResultContent();
    const cardResult = renderResults(tvSearchResults);

    cardResult.map((result) => {
      searchResultEl.append(result);
    });
    notClicked = true;
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
  const clickedResultText = e.target.textContent;
  notClicked = false;
  renderSearchResult(clickedResultText);
  removeSearchResultList();
  inputEl.value = "";
});

// -------------------------------------------------------------------------
// Remore dropdown results
const removeSearchResultList = function () {
  while (resultListEl.firstChild) {
    resultListEl.removeChild(resultListEl.firstChild);
  }
  resultListEl.classList.add("hidden");
};

// -------------------------------------------------------------------------
// Remove the search result (main area)
const removeSearchResultContent = function () {
  while (searchResultEl.firstChild) {
    searchResultEl.removeChild(searchResultEl.firstChild);
  }
};
// -------------------------------------------------------------------------

// Render the search result content
const renderResults = function (tvSearchResults) {
  const tvShowCardResultEl = tvSearchResults.map((tv) => {
    const tvCard = document.createElement("div");
    tvCard.classList.add("tv-show-card");
    tvCard.style.backgroundImage = `url('${tv.show?.image?.medium || ""}')`;
    const tvName =
      tv.show?.name.length >= 24
        ? tv.show?.name.substring(0, 21) + "..."
        : tv.show?.name;
    const summaryText =
      tv.show?.summary?.length >= 140
        ? tv.show?.summary.substring(0, 137) + "..."
        : tv.show?.summary;
    const html = `
            <div class="tv-show-content">
                 <div class="tv-show-title">${tvName}</div>
            <div class="tv-show-summary">${summaryText}</div>
                <button class="learn-more-btn data-${tv.show?.externals?.imdb}" >Learn More</button>
            </div>
        `;
    tvCard.insertAdjacentHTML("beforeend", html);

    const learnMoreBtn = tvCard.querySelector(".learn-more-btn");
    learnMoreBtn.addEventListener("click", function () {
      const name = tv.show?.name;
      console.log(`TV name is ${name}`);
      removeSearchResultContent();
      const moreDetailsEl = renderMoreDetailsElements(tv);
      searchResultEl.insertAdjacentHTML("beforeend", moreDetailsEl);
    });

    return tvCard;
  });
  return tvShowCardResultEl;
};

document.querySelector("body").addEventListener("click", function (e) {
  if (!e.target.closest(".search-result")) {
    removeSearchResultList();
  }
});

const renderMoreDetailsElements = function (tv) {
  const imdbLink = `https://www.imdb.com/title/${tv.show?.externals?.imdb}`;
  const tvrageLink = `https://www.imdb.com/title/${tv.show?.externals?.tvrage}`;
  const thetvdbLink = `https://www.imdb.com/title/${tv.show?.externals?.thetvdb}`;
  const html = `
    <div class="more-details">
            <div class="poster">
                <img class="poster-image" src="${tv.show?.image?.original}"
                    alt="${tv.show?.name} poster">
            </div>
            <div class="tv-show-info">
                <div class="info-title">🎞TV Show Information</div>
                <div class="name">Name: <span>${tv.show?.name}</span></div>
                <div class="runtime">Runtime: <span>${
                  tv.show?.runtime || "Unknown"
                }</span></div>
                <div class="premiered">Premiered on: <span>${
                  tv.show?.premiered || "Unknown"
                }</span></div>
                <div class="ended">Ended on: <span>${
                  tv.show?.ended || "Still running"
                }</span></div>
                <div class="official-site">Official site: <a class="external-link-official" href="${
                  tv.show?.officialSite
                }"><i class="fas fa-external-link-alt"></i></a></div>
                <div class="ratings">Rating: <span>${
                  tv.show?.rating?.average || "No"
                }</span>⭐</div>
            </div>
            <div class="tv-show-details">
                <div class="details-title">🎬Details</div>
                <div class="country">Country: <span>${
                  tv.show?.network?.country?.name || "Unknown"
                }</span></div>
                <div class="language">Language: <span>${
                  tv.show?.language || "Unknown"
                }</span></div>
                <div class="network">Network: <span>${
                  tv.show?.network?.name || "Unknown"
                }</span></div>
                <div class="summary">Summary: <span class=summary-text>${
                  tv.show?.summary || ""
                }</span></div>
            </div>
            <div class="external-links">
                <div>Check is out at: </div>
                <div class="imdb-links"><a class="external-link external-link-imdb" href="${imdbLink}"></a></div>
                <div class="tvrage"><a class="external-link external-link-tvrage" href="${tvrageLink}"></a></div>
                <div class="thetvdb"><a class="external-link external-link-thetvdb" href="${thetvdbLink}"></a></div>
            </div>
        </div>
    `;
  return html;
};
