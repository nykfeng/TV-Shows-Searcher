import fetch from "./fetch.js";
import trending from "./trending.js";

// Sentinel for expand collpase button
let expanded = false;
// number of total list to render after user scroll
// maximum will be 10 lists, a total of 60 trending tv shows
let listRendered = 0;

const renderItemHtml = function (tv, i) {
  const html = `
    <div class="trending-see-more__show-poster-container">
        <img src="${tv.image.original}" alt="${tv.name} poster"
            class="trending-see-more-poster-img">
    </div>
    <div class="trending-see-more__content">

        <div class="trending-see-more__show-title">${tv.name}</div>
        <div class="trending-see-more__show-rank ${
          i === 0
            ? "gold-rank"
            : i === 1
            ? "silver-rank"
            : i === 2
            ? "bronze-rank"
            : ""
        }">${i + 1}</div>

        <div class="trending-see-more__show-content">
            <div class="trending-see-more__show-mid-container">

                <div class="trending-see-more__show-genre">${
                  tv.genres.join(", ") || "Various"
                }</div>
                <div class="trending-see-more__show-score">
                    <div class="stars-outer">
                        <div class="stars-inner" style="width:${
                          parseFloat(tv.rating.average) * 10
                        }%;"></div>
                    </div>
                    <div class="show-score-number">${tv.rating.average}</div>
                </div>
                <div class="trending-see-more__show-network"><b>${
                  tv.network ? tv.network.name : tv.webChannel.name
                }</b></div>
                <div class="trending-see-more__show-summary">${tv.summary}
                   
                </div>
                <div class="watch-options">
                    <div class="trailer-option">
                        <a class="trailer-option-btn" href="${youtubeTrailerUrlQuery(
                          tv.name
                        )}">Youtube</a>
                    </div>
                    <div class="watch-now-option">
                        <a class="watch-now-option-btn" href="${
                          tv.officialSite
                        }">Watch Now</a>
                    </div>
                </div>
            </div>

            <div class="trending-see-more__show-end-container">
                ${renderCastHtml(tv._embedded.cast)}
            </div>
        </div>
    </div>

    
    `;
  return html;
};

const renderCastHtml = function (tvCast) {
  if (tvCast.lenght === 0) return;
  let html = "";

  // Only want to render at max 8 cast people here
  const numberToRender = tvCast.length < 8 ? tvCast.length : 8;
  for (let i = 0; i < numberToRender; i++) {
    if (tvCast[i].person.image) {
      html += `
        <div class="trending-cast-detail">
            <img src="${tvCast[i].person?.image.medium}"
                alt="tv cast image" class="trending-cast-img">
                <p class="trending-cast-name" data-cast-id="533">${tvCast[i].person.name}</p>
        </div>
     `;
    }
  }
  return html;
};

// helper function for youtube url
// https://www.youtube.com/results?search_query=the+expanse+trailer
const youtubeTrailerUrlQuery = function (showName) {
  showName = showName.replace(/\s/g, "+");
  return `https://www.youtube.com/results?search_query=${showName}+trailer`;
};

const renderingTrendingSeeMore = function () {
  // create item element
  // render item skeleton elements
  // fetch complete .then
  // remove skeleton elements
  // append complete elements
};

const hideUnhideTrendingTV = function (expanded) {
  const sliderBtns = document.querySelectorAll(".slider-button");
  const trendingEl = document.querySelector(".trendingTV");
  if (expanded) {
    sliderBtns.forEach((btn) => {
      btn.classList.add("hide-it");
    });
    trendingEl.classList.add("hide-it");
  } else {
    sliderBtns.forEach((btn) => {
      btn.classList.remove("hide-it");
    });
    trendingEl.classList.remove("hide-it");
  }
};

// render content loader element for trending see more

const renderContent = function (tvShowCodeList) {
  const trendingTVBlockEl = document.querySelector(".main-display-content");

  const seeMoreDivEl = document.createElement("div");
  seeMoreDivEl.classList = "trending-see-more";

  // appending the whole see more section
  trendingTVBlockEl.append(seeMoreDivEl);
  renderIndividualItem(tvShowCodeList, seeMoreDivEl, listRendered);
  listRendered++;
};

// individual item render
const renderIndividualItem = function (
  tvShowCodeList,
  seeMoreDivEl,
  listRendered
) {
  // this will fetch 6 tv shows each time
  const indexToFetch = listRendered * 6;
  console.log("listRendered", listRendered);
  console.log("indexToFetch", indexToFetch);
  for (let i = indexToFetch; i < indexToFetch + 6; i++) {
    const seeMoreItemEl = document.createElement("div");
    seeMoreItemEl.classList = "trending-see-more__show-item";
    seeMoreDivEl.append(seeMoreItemEl);
    seeMoreItemEl.insertAdjacentHTML("beforeend", contentLoaderHtml());
    const tvShowDetailData = fetch.TVShowByCodeEmbeddedCast(tvShowCodeList[i]);
    tvShowDetailData.then((tvShow) => {
      console.log(tvShow.data);
      seeMoreItemEl.innerHTML = renderItemHtml(tvShow.data, i);
    });
  }
};

const duplcateContentLoaderHtml = function (number) {
  let html = "";
  for (let i = 0; i < number; i++) {
    html += `<div class="content-placeholder-text animated-bg cph-text">&nbsp;</div>`;
  }
  return html;
};

const contentLoaderHtml = function () {
  const html = `
    <div class="content-placeholder-card">
        <div class="content-placeholder-img animated-bg cph-img">&nbsp;</div>
    </div>

    <div class="cph-content">
        <div class="content-placeholder-text animated-bg cph-title">&nbsp;</div>

    <div class="cph-text-content">
        <div class="cph-summary trending-see-more__show-mid-container">
        ${duplcateContentLoaderHtml(6)}
            <div class="cph-btns">
            ${duplcateContentLoaderHtml(2)}
            </div>
        </div>

        <div class="cph-cast trending-see-more__show-end-container">
        ${duplcateContentLoaderHtml(6)}
        </div>
    </div>
</div>
    `;
  return html;
};

// Manage trending see more option
const expandBtn = function (trendingListCode) {
  let seeMoreDivEl = document.querySelector(".trending-see-more");
  const seeMoreBtn = document.querySelector(".trending-title-expand");

  console.log("Clicked", expanded);
  if (!expanded) {
    // If the see more trending tv element has not yet generated
    if (!seeMoreDivEl) {
      renderContent(trendingListCode);
      // openCastInfoInShowDetails(); use to listen for name clicks
      expanded = true;
      hideUnhideTrendingTV(expanded);
      seeMoreBtn.innerHTML = trending.expandOrCollpaseBtnsHtml(expanded);
    } else {
      // cast info is there, so no need to generate again, set display
      seeMoreDivEl.style.display = "flex";
      expanded = true;
      hideUnhideTrendingTV(expanded);
      seeMoreBtn.innerHTML = trending.expandOrCollpaseBtnsHtml(expanded);
    }
  } else {
    // cast info is there set display to none to hide
    seeMoreDivEl = document.querySelector(".trending-see-more");
    seeMoreDivEl.style.display = "none";
    expanded = false;
    hideUnhideTrendingTV(expanded);
    seeMoreBtn.innerHTML = trending.expandOrCollpaseBtnsHtml(expanded);
  }
};

// add the window listener for scroll, add and remove toggle it

export default {
  hideUnhideTrendingTV,
  renderContent,
  expandBtn,
};
