import fetch from "./fetch.js";
import trending from "./trending.js";

// Sentinel for expand collpase button
let expanded = false;

const renderItemHtml = function (tv, i) {
  const html = `
    <div class="trending-see-more__show-item">
    <div class="trending-see-more__show-poster-container">
        <img src="https://static.tvmaze.com/uploads/images/original_untouched/241/602832.jpg" alt=""
            class="trending-see-more-poster-img">
    </div>
    <div class="trending-see-more__content">

        <div class="trending-see-more__show-title">Westworld</div>
        <div class="trending-see-more__show-rank trending-rank">1</div>

        <div class="trending-see-more__show-content">
            <div class="trending-see-more__show-mid-container">

                <div class="trending-see-more__show-genre">Drama, Science-Fiction, Western</div>
                <div class="trending-see-more__show-score">
                    <div class="stars-outer">
                        <div class="stars-inner"></div>
                    </div>
                    <div class="show-score-number">8.7</div>
                </div>
                <div class="trending-see-more__show-network">HBO</div>
                <div class="trending-see-more__show-summary">
                    <p><b>Westworld</b> is a dark odyssey about the dawn of artificial consciousness and the
                        evolution
                        of sin. Set at the intersection of the near future and the reimagined past, it explores
                        a
                        world
                        in which every human appetite, no matter how noble or depraved, can be indulged.</p>
                </div>
                <div class="watch-options">
                    <div class="trailer-option">
                        <button class="trailer-option-btn">Youtube</button>
                    </div>
                    <div class="watch-now-option">
                        <button class="watch-now-option-btn">Watch Now</button>
                    </div>
                </div>
            </div>

            <div class="trending-see-more__show-end-container">
                ${renderCastHtml(tv._embeddedCast)}
            </div>
        </div>
    </div>
</div>
    
    `;
  return html;
};

const renderCastHtml = function (tvCast) {
  if (tvCast.lenght === 0) return;
  let html;

  // Only want to render at max 8 cast people here
  const numberToRender = tvCast.length < 8 ? tvCast.length : 8;
  for (let i = 0; i < numberToRender; i++) {
    html += `
        <div class="trending-cast-detail">
            <img src="https://static.tvmaze.com/uploads/images/medium_portrait/162/406769.jpg"
                alt="tv cast image" class="trending-cast-img">
                <p class="trending-cast-name" data-cast-id="533">${23}</p>
        </div>
     `;
  }
  return html;
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
  renderIndividualItem(tvShowCodeList, seeMoreDivEl);
};

// individual item render
const renderIndividualItem = function (tvShowCodeList, seeMoreDivEl) {
  for (let i = 0; i < tvShowCodeList.length; i++) {
    const seeMoreItemEl = document.createElement("div");
    seeMoreItemEl.classList = "trending-see-more__show-item";
    seeMoreDivEl.append(seeMoreItemEl);
    seeMoreItemEl.insertAdjacentHTML("beforeend", contentLoaderHtml());
    // const tvShowDetailData = fetch.TVShowByCodeEmbeddedCast(tvShowCodeList[i]);
    // tvShowDetailData.then((data) => {
    //   console.log(data);
    //   // itemEl.innerHTML = renderItemHtml(data);
    // });
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
