import fetch from "./js/fetch.js";
import trending from "./js/trending.js";
import cast from "./js/cast.js";
import people from "./js/people.js";

const inputEl = document.querySelector(".input-bar");
const resultListEl = document.querySelector(".result-list");
const searchBtn = document.querySelector(".search-bar-btn");
const searchResultEl = document.querySelector(".result-area");
const mainDisplayEl = document.querySelector(".main-display-content");
let currentInputVal;

let tvSearchResults = [];

// -------------------------------------------------------------------------
// Listen for input change from the search box
inputEl.addEventListener("input", async function (e) {
  if (e.target.value === "") {
    removeSearchResultList();
    removeSearchResultContent();
    console.log("Emptied search input");
    return;
  }

  let currentInput = e.target.value.toLowerCase();
  currentInputVal = currentInput;
  if (currentInputVal !== "") {
    renderSearchResult(currentInputVal);
  }
});

const renderSearchResult = async function (currentInput) {
  if (currentInput) {
    tvSearchResults = await fetch.TVShows(currentInput);
    resultListEl.classList.remove("hidden");

    // Render the dropdown list result
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
      // If the array of search result is empty
      removeSearchResultList();
    }

    // Render the search result in card form in the main result area
    renderResultOnPage(createResultHtml(tvSearchResults));

    // Click the result from the dropdown list
    resultListEl.addEventListener("click", function (e) {
      const currentListEl = e.target.closest(".dropdown-list");
      const clickedTVShowName =
        currentListEl.querySelector(".dropdown-tv-name").textContent;

      // Find the specific click result from the array
      const result = tvSearchResults.filter(
        (tv) => tv.show.name === clickedTVShowName
      );
      // Render the specific click result from the dropdown list
      renderResultOnPage(createResultHtml(result));
      // TODO
      // Change the flex justify-content attribute to left from center
      resultListEl.classList.add("hidden");
    });
  }
};

// Click the search button to Google it more
searchBtn.addEventListener("click", function () {
  const value = currentInputVal;
  if (value) {
    const url = `http://www.google.com/search?q=${value}`;
    window.open(url, "_blank");
    removeSearchResultList();
  }
});

// -------------------------------------------------------------------------
// Remove dropdown results
const removeSearchResultList = function () {
  while (resultListEl.firstChild) {
    resultListEl.removeChild(resultListEl.firstChild);
  }
  // If the result area element does not have hidden class, add it
  if (!resultListEl.classList.contains("hidden")) {
    resultListEl.classList.add("hidden");
  }
};

// -------------------------------------------------------------------------
// Remove the search result (result area)
const removeSearchResultContent = function () {
  while (searchResultEl.firstChild) {
    searchResultEl.removeChild(searchResultEl.firstChild);
  }
};
// -------------------------------------------------------------------------

// Create the search result content
const createResultHtml = function (tvSearchResults) {
  const tvShowCardResultEl = tvSearchResults.map((tv) => {
    const tvCard = document.createElement("div");
    tvCard.classList.add("tv-show-card");
    tvCard.style.backgroundImage = `url('${tv.show?.image?.original || ""}')`;
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
      removeSearchResultContent();
      const moreDetailsEl = renderMoreDetailsElements(tv);
      searchResultEl.insertAdjacentHTML("beforeend", moreDetailsEl);

      showCastInTVShowDetails(tv.show.id);
    });

    return tvCard;
  });
  return tvShowCardResultEl;
};

// Listen for cast dropdown button - render and hide unhide
const showCastInTVShowDetails = function (showID) {
  const dropdownBtn = document.querySelector(".cast-title-dropdown");
  let expanded = false;
  dropdownBtn.addEventListener("click", function () {
    let castGridEl = document.querySelector(".tv-show-cast-grid");
    if (!expanded) {
      // If the cast grid info has not set generated
      if (!castGridEl) {
        cast.renderInDetails(showID);
        expanded = true;
        dropdownBtn.innerHTML = `<i class="fas fa-chevron-circle-up"></i>`;
      } else {
        // cast info is there, so no need to generate again, set display
        castGridEl.style.display = "grid";
        expanded = true;
        dropdownBtn.innerHTML = `<i class="fas fa-chevron-circle-up"></i>`;
      }
    } else {
      // cast info is there set display to none to hide
      castGridEl = document.querySelector(".tv-show-cast-grid");
      castGridEl.style.display = "none";
      expanded = false;
      dropdownBtn.innerHTML = `<i class="fas fa-chevron-circle-down">`;
    }
  });
};

// Render the search result content
const renderResultOnPage = function (resultEl) {
  removeSearchResultContent();
  const cardResult = resultEl;
  cardResult.map((result) => {
    searchResultEl.append(result);
  });
};

// Click anywhere else on the page other than dropdown list to close it
document.querySelector("body").addEventListener("click", function (e) {
  if (!e.target.closest(".search-result")) {
    removeSearchResultList();
  }
});

// Create the html elements for More Details page
const renderMoreDetailsElements = function (tv) {
  const imdbLink = `https://www.imdb.com/title/${tv.show?.externals?.imdb}`;
  const tvrageLink = `https://www.tvrage.com/title/${tv.show?.externals?.tvrage}`;
  const thetvdbLink = `https://www.thetvdb.com/search?query=${tv.show?.externals?.thetvdb}`;
  const html = `
    <div class="more-details">
            <div class="poster">
                <img class="poster-image" src="${tv.show?.image?.original}"
                    alt="${tv.show?.name} poster">
            </div>
            <div class="tv-show-info">
                <div class="info-title">🎬TV Show Information</div>
                <div class="name">Name: <span>${tv.show?.name}</span></div>
                <div class="runtime">Runtime: <span>${
                  tv.show?.runtime || "Varies"
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
                  tv.show?.network?.country?.name || "Varies"
                }</span></div>
                <div class="language">Language: <span>${
                  tv.show?.language || "Unknown"
                }</span></div>
                <div class="network">Network: <span>${
                  tv.show?.network?.name || "Varies"
                }</span></div>
                <div class="summary">Summary: <span class=summary-text>${
                  tv.show?.summary || ""
                }</span></div>
            </div>
            <div class="external-links-div">
                <div>More on: </div>
                <div class="imdb-links"><a class="external-link external-link-imdb" href="${imdbLink}"></a></div>
                <div class="tvrage"><a class="external-link external-link-tvrage" href="${tvrageLink}"></a></div>
                <div class="thetvdb"><a class="external-link external-link-thetvdb" href="${thetvdbLink}"></a></div>
            </div>
            <div class="tv-show-cast">
              <div class="cast-title">
              <p class="cast-title-text">🎬Cast</p>
              <button class="cast-title-dropdown"><i class="fas fa-chevron-circle-down"></i></button>
              
              </div>


            </div>
        </div>
    `;
  return html;
};

const trendingAndPopularTvShows = async function () {
  const trendingListCode = [];
  const parser = new DOMParser();
  const popularTVHtml = parser.parseFromString(
    await fetch.trendingTV(),
    "text/html"
  );
  const NUMBER_TRENDING = 15; // Want to show 15 trending/popular shows

  // Pulling the list from the website
  const tvNamesEl = popularTVHtml.querySelectorAll(".column-block");
  tvNamesEl.forEach((tvEl) => {
    trendingListCode.push(tvEl.getAttribute("data-key"));
  });

  const TVShowFullInfo = []; // To store both show and cast info

  // Now make API calls to get tv show info and cast info
  for (let i = 0; i < NUMBER_TRENDING; i++) {
    const tvShowInfo = await fetch.TVShowByCode(trendingListCode[i]);
    const tvShowCastInfo = await fetch.TVShowCast(trendingListCode[i]);

    TVShowFullInfo.push({ showInfo: tvShowInfo, cast: tvShowCastInfo });
  }

  // Now we can render them
  // console.log(TVShowFullInfo);
  const trendingEl = renderTrendingElements(TVShowFullInfo);

  mainDisplayEl.append(trendingEl);
  scaleTitleTextToFit();

  // Manage the cards for the slider here
  trending.resetCards();

  // Listen for buttons after they are rendered
  const leftBtn = document.querySelector(".left-slider-btn");
  const rightBtn = document.querySelector(".right-slider-btn");
  leftBtn.addEventListener("click", trending.leftBtnActions);
  rightBtn.addEventListener("click", trending.rightBtnActions);

  // Listen for actor names clicked
  const trendingTVEl = document.querySelector(".trendingTV");
  trendingTVEl.addEventListener("click", function (e) {
    if (e.target.classList.contains("trending-cast-name")) {
      const peopleId = e.target.dataset.castId;
      // Remove already existed elements
      removeSearchResultContent();
      people.renderPeopleDetails(peopleId);
    }
  });
};

const scaleTitleTextToFit = function () {
  const trendingNameEls = document.querySelectorAll(".trending-name");

  trendingNameEls.forEach((titleEl) => {
    if (titleEl.textContent.length > 16) {
      titleEl.style.fontSize = "3rem";
    }
    if (titleEl.textContent.length > 21) {
      titleEl.style.fontSize = "2.5rem";
    }
    if (titleEl.textContent.length >= 26) {
      titleEl.textContent = titleEl.textContent.substring(0, 23) + "...";
      titleEl.style.fontSize = "2rem";
    }
  });
};

const renderTrendingElements = function (trendingListOfTVToRender) {
  const trendingTVDivEl = document.createElement("div");
  trendingTVDivEl.classList = "trendingTV";
  const trendingTVDivTitleEl = document.createElement("div");
  trendingTVDivTitleEl.classList = "trending-title";
  trendingTVDivTitleEl.textContent = "📡Trending/Popular TV";

  mainDisplayEl.append(trendingTVDivTitleEl);
  trendingTVDivTitleEl.insertAdjacentHTML(
    "afterend",
    renderSliderLeftBtnElements()
  );

  trendingListOfTVToRender.forEach((tv, i) => {
    const trendingCardEl = document.createElement("div");
    trendingCardEl.classList = "trending-card";
    trendingCardEl.classList.add(`slider-${i + 1}`);

    const html = `
            <div class="trending-rank ${
              i === 0
                ? "gold-rank"
                : i === 1
                ? "silver-rank"
                : i === 2
                ? "bronze-rank"
                : ""
            }">${i + 1}</div>
            <div class="trending-card-front">
                <img class="front-image"
                    src="${tv.showInfo.data.image.original}" alt="${
      tv.showInfo.data.name
    } poster">
                <div class="trending-name">${tv.showInfo.data.name}</div>
                <div class="bottom-info">
                    <div class="trending-rating">
                        <span>${tv.showInfo.data.rating.average}</span>
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="trending-cast">
                        <img src="${
                          tv.cast.data["0"].person.image.medium
                        }" alt="${tv.cast.data["0"].person.name}"
                            class="trending-cast-img">
                        <img src="${
                          tv.cast.data["1"].person.image.medium
                        }" alt="${tv.cast.data["1"].person.name}"
                            class="trending-cast-img">
                        <img src="${
                          tv.cast.data["2"].person.image.medium
                        }" alt="${tv.cast.data["2"].person.name}"
                            class="trending-cast-img">
                    </div>
                </div>
            </div>
            <div class="trending-card-back">
                <a class="trending-start-watching" href="${
                  tv.showInfo.data.officialSite
                }">Start Watching</a>
                <div class="trending-cast-more">
                    <div class="trending-cast-detail">
                        <img src="${
                          tv.cast.data["0"].person.image.medium
                        }" alt="${tv.cast.data["0"].person.name}"
                            class="trending-cast-img">
                        <p class="trending-cast-name" data-cast-id='${
                          tv.cast.data["0"].person.id
                        }'>${tv.cast.data["0"].person.name}</p>
                    </div>
                    <div class="trending-cast-detail">
                        <img src="${
                          tv.cast.data["1"].person.image.medium
                        }" alt="${tv.cast.data["1"].person.name}"
                            class="trending-cast-img">
                        <p class="trending-cast-name" data-cast-id='${
                          tv.cast.data["1"].person.id
                        }'>${tv.cast.data["1"].person.name}</p>
                    </div>
                    <div class="trending-cast-detail">
                        <img src="${
                          tv.cast.data["2"].person.image.medium
                        }" alt="${tv.cast.data["2"].person.name}"
                            class="trending-cast-img">
                        <p class="trending-cast-name" data-cast-id='${
                          tv.cast.data["2"].person.id
                        }'>${tv.cast.data["2"].person.name}</p>
                    </div>
                </div>
            </div>
      `;

    trendingCardEl.insertAdjacentHTML("beforeend", html);
    const trendingShowBackgroundDivEL = document.createElement("div");
    trendingShowBackgroundDivEL.classList = "trending-card-background";
    trendingShowBackgroundDivEL.style.backgroundImage = `url('${
      tv.showInfo.data.image.original || ""
    }')`;
    trendingCardEl.append(trendingShowBackgroundDivEL);

    trendingTVDivEl.append(trendingCardEl);
  });
  mainDisplayEl.insertAdjacentHTML("beforeend", renderSliderRightBtnElements());

  return trendingTVDivEl;
};

trendingAndPopularTvShows();

const renderSliderLeftBtnElements = function () {
  const html = `<button class="slider-button left-slider-btn"><i class="fas fa-chevron-left"></i></button>`;
  return html;
};

const renderSliderRightBtnElements = function () {
  const html = `<button class="slider-button right-slider-btn"><i class="fas fa-chevron-right"></i></button>`;
  return html;
};

// await people.renderPeopleDetails("40099");
