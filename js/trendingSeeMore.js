import fetch from "./fetch.js";
import trending from "./trending.js";

// Sentinel for expand collpase button
let expanded = false;
// number of total list to render after user scroll
// maximum will be 10 lists, a total of 60 trending tv shows
let listRendered = 0;
let pageNumber = listRendered + 1;
let trendingListCode;

// render the html element of each tv show item
const renderItemHtml = function (tv, i) {
  // const html = `
  //   <div class="trending-see-more__show-poster-container">
  //       <img src="${tv.image.original}" alt="${tv.name} poster"
  //           class="trending-see-more-poster-img" data-show-id="${tv.id}">
  //   </div>
  //   <div class="trending-see-more__content">

  //       <div class="trending-see-more__show-title" data-show-id="${tv.id}">${
  //   tv.name
  // }</div>
  //       <div class="trending-see-more__show-rank ${
  //         i === 0
  //           ? "gold-rank"
  //           : i === 1
  //           ? "silver-rank"
  //           : i === 2
  //           ? "bronze-rank"
  //           : ""
  //       }">${i + 1}</div>

  //       <div class="trending-see-more__show-content">
  //           <div class="trending-see-more__show-mid-container">

  //               <div class="trending-see-more__show-genre">${
  //                 tv.genres.join(", ") || "Various"
  //               }</div>
  //               <div class="trending-see-more__show-score">
  //                   <div class="stars-outer">
  //                       <div class="stars-inner" style="width:${
  //                         parseFloat(tv.rating.average) * 10
  //                       }%;"></div>
  //                   </div>
  //                   <div class="show-score-number">${tv.rating.average}</div>
  //               </div>
  //               <div class="trending-see-more__show-network"><b>${
  //                 tv.network ? tv.network.name : tv.webChannel.name
  //               }</b></div>
  //               <div class="trending-see-more__show-summary">${tv.summary}

  //               </div>
  //               <div class="watch-options">
  //                   <div class="trailer-option">
  //                       <a class="trailer-option-btn trending-btn" href="${youtubeTrailerUrlQuery(
  //                         tv.name
  //                       )}">Youtube</a>
  //                   </div>
  //                   <div class="watch-now-option">
  //                       <a class="watch-now-option-btn trending-btn" href="${
  //                         tv.officialSite
  //                       }">Watch Now</a>
  //                   </div>
  //               </div>
  //           </div>

  //           <div class="trending-see-more__show-end-container">
  //               ${renderCastHtml(tv._embedded.cast)}
  //           </div>
  //       </div>
  //   </div>
  //   `;
  const html = `
    <div class="tsm__show-poster-container">
        <img src="${tv.image.original}" alt="${tv.name} poster"
            class="tsm-poster-img" data-show-id="${tv.id}">
    </div>
    <div class="tsm__show-title" data-show-id="${tv.id}">${tv.name}</div>
          <div class="trending-rank ${
            i === 0
              ? "gold-rank"
              : i === 1
              ? "silver-rank"
              : i === 2
              ? "bronze-rank"
              : ""
          }">${i + 1}</div>

          <div class="tsm__show-mid-container">

          <div class="tsm__show-genre">${
            tv.genres.join(", ") || "Various"
          }</div>
          <div class="tsm__show-score">
              <div class="stars-outer">
                  <div class="stars-inner" style="width:${
                    parseFloat(tv.rating.average) * 10
                  }%;"></div>
              </div>
              <div class="show-score-number">${tv.rating.average}</div>
          </div>
          <div class="tsm__show-network"><b>${
            tv.network ? tv.network.name : tv.webChannel.name
          }</b></div>
          <div class="tsm__show-summary">${tv.summary}
             
          </div>
          <div class="watch-options">
              <div class="trailer-option">
                  <a class="trailer-option-btn trending-btn" href="${youtubeTrailerUrlQuery(
                    tv.name
                  )}" target="_blank">Youtube</a>
              </div>
              <div class="watch-now-option">
                  <a class="watch-now-option-btn trending-btn" href="${
                    tv.officialSite
                  }" target="_blank">Watch Now</a>
              </div>
          </div>
      </div>
      <div class="tsm__show-end-container">
      ${renderCastHtml(tv._embedded.cast)}
    </div>

    `;
  return html;
};

// There will be at most 8 cast per show, so make it a function to not duplicate codes
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
                <p class="trending-cast-name" data-cast-id="${tvCast[i].person.id}">${tvCast[i].person.name}</p>
        </div>
     `;
    }
  }
  return html;
};

// helper function for youtube url
const youtubeTrailerUrlQuery = function (showName) {
  showName = showName.replace(/\s/g, "+");
  return `https://www.youtube.com/results?search_query=${showName}+trailer`;
};

// toggle hide and unhide the trending tv elements
const hideUnhideTrendingTV = function () {
  const sliderBtns = document.querySelectorAll(".slider-button");
  const trendingEl = document.querySelector(".trendingTV");

  sliderBtns.forEach((btn) => {
    btn.classList.toggle("hide-it");
  });
  trendingEl.classList.toggle("hide-it");
};

// render content loader element for trending see more
const renderContent = function (tvShowCodeList) {
  const trendingTVBlockEl = document.querySelector(".main-trending-content");

  const seeMoreDivEl = document.createElement("div");
  seeMoreDivEl.classList = "trending-see-more";

  // appending the whole see more section
  trendingTVBlockEl.append(seeMoreDivEl);
  renderIndividualItem(tvShowCodeList, seeMoreDivEl, listRendered);
  listRendered++;
  trendingTVBlockEl.append(renderPaginationBtns());
  paginationBtnStatus(); // set the prev next btn to gray-out when page = 1, page = 6
  paginationBtnActions();
};

// pagination button status
// set the prev next btn to gray-out when page = 1, page = 6
const paginationBtnStatus = function () {
  const prevBtn = document.querySelector(".previous-btn");
  const nextbtn = document.querySelector(".next-btn");

  if (pageNumber === 1) {
    prevBtn.classList.add("inactive");
  } else if (pageNumber === 6) {
    nextbtn.classList.add("inactive");
  } else {
    prevBtn.classList.remove("inactive");
    nextbtn.classList.remove("inactive");
  }
};

// Need to listen for pagination buttons for actions
const paginationBtnActions = function () {
  const prevBtn = document.querySelector(".previous-btn");
  const nextBtn = document.querySelector(".next-btn");

  nextBtn.addEventListener("click", nextPageAction);
  prevBtn.addEventListener("click", prevPageAction);
};

// individual item render
const renderIndividualItem = function (
  tvShowCodeList,
  seeMoreDivEl,
  listRendered
) {
  // this will fetch 6 tv shows each time, because 6 items per page
  const indexToFetch = listRendered * 6;

  for (
    let i = indexToFetch;
    i < indexToFetch + 6 && i < tvShowCodeList.length;
    i++
  ) {
    const seeMoreItemEl = document.createElement("div");
    seeMoreItemEl.classList = "trending-see-more__show-item";
    // set data attribute with page number, so we can use it to hide the items later
    seeMoreItemEl.setAttribute("data-page", pageNumber);
    seeMoreDivEl.append(seeMoreItemEl);

    // add content loader html
    seeMoreItemEl.insertAdjacentHTML("beforeend", contentLoaderHtml());
    // fetch data for each
    const tvShowDetailData = fetch.TVShowByCodeEmbeddedCast(tvShowCodeList[i]);
    tvShowDetailData.then((tvShow) => {
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
const expandBtn = function (listCode) {
  let seeMoreDivEl = document.querySelector(".trending-see-more");
  const seeMoreBtn = document.querySelector(".trending-title .expand-toggle");
  let paginationBtnsEl = document.querySelector(".pagination-btns");
  trendingListCode = listCode;

  if (!expanded) {
    // If the see more trending tv element has not yet generated
    if (!seeMoreDivEl) {
      renderContent(trendingListCode);
      paginationBtnsEl = document.querySelector(".pagination-btns");
      // openCastInfoInShowDetails(); use to listen for name clicks
      expanded = true;
      hideUnhideTrendingTV();
      seeMoreBtn.innerHTML = trending.expandOrCollpaseBtnsHtml(expanded);
    } else {
      // cast info is there, so no need to generate again, set display
      seeMoreDivEl.style.display = "flex";
      paginationBtnsEl.style.display = "flex";
      expanded = true;
      hideUnhideTrendingTV();
      seeMoreBtn.innerHTML = trending.expandOrCollpaseBtnsHtml(expanded);
    }
  } else {
    // hide all the trending see more items if the button clicked was to collpase them
    seeMoreDivEl = document.querySelector(".trending-see-more");
    paginationBtnsEl = document.querySelector(".pagination-btns");
    seeMoreDivEl.style.display = "none";
    paginationBtnsEl.style.display = "none";
    expanded = false;
    hideUnhideTrendingTV();
    seeMoreBtn.innerHTML = trending.expandOrCollpaseBtnsHtml(expanded);
  }
};

// next page button action
const nextPageAction = function () {
  if (pageNumber === 6) return;
  const nextPageNumber = pageNumber + 1;
  const nextPageItemEl = document.querySelector(
    `[data-page='${nextPageNumber}']`
  );
  const seeMoreDivEl = document.querySelector(".trending-see-more");

  // if the list of next page doesn't exist, we render it
  if (!nextPageItemEl) {
    // before rendering next page, hide the current page items
    toggleDisplayCurrentPageItems(pageNumber);

    // add 1 page to current page number variable
    // the render individual item function relys on pageNumber variable
    pageNumber++;
    // now render next page items
    renderIndividualItem(trendingListCode, seeMoreDivEl, listRendered);

    // at last list rendered +1 too
    listRendered++;
  } else {
    // since they have been rendered before

    // hide the current page items
    toggleDisplayCurrentPageItems(pageNumber);
    // reveal the next page items
    toggleDisplayCurrentPageItems(nextPageNumber);
    pageNumber++;
  }
  paginationBtnStatus();
};

// previous page button action
const prevPageAction = function () {
  if (pageNumber === 1) return;
  const prevPageNumber = pageNumber - 1;
  // const prevPageItemEl = document.querySelector(
  //   `[data-page='${prevPageNumber}']`
  // );

  // since they have been rendered before

  // hide the current page items
  toggleDisplayCurrentPageItems(pageNumber);
  // reveal the prev page items
  toggleDisplayCurrentPageItems(prevPageNumber);
  pageNumber--;

  paginationBtnStatus();
};

// Create pagination buttons, prev and next
const renderPaginationBtns = function () {
  const paginationBtns = document.createElement("div");
  paginationBtns.classList = "pagination-btns";
  const prevBtn = document.createElement("button");
  const nextBtn = document.createElement("button");
  prevBtn.textContent = "PREV";
  nextBtn.textContent = "NEXT";
  prevBtn.classList = "previous-btn trending-btn";
  nextBtn.classList = "next-btn trending-btn";
  paginationBtns.append(prevBtn);
  paginationBtns.append(nextBtn);

  return paginationBtns;
};

// hiding trending tv show items of the current page
const toggleDisplayCurrentPageItems = function (page) {
  const pageItemEls = document.querySelectorAll(`[data-page='${page}']`);
  pageItemEls.forEach((item) => {
    item.classList.toggle("hide-it");
  });
};

// Event listener for items on see more
const addAListener = function () {};

export default {
  hideUnhideTrendingTV,
  renderContent,
  expandBtn,
};
