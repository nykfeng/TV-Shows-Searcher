import trending from "./trending.js";
import upcoming from "./upcoming.js";

// Sentinel for expand collpase button
let expanded = false;

// render the html elements of each season premier tv show item
const renderItemHtml = function (tv) {
  const html = `
  <div class="upcoming-card" data-show-id="${tv.showId}"
  style="background-image: url(${upcoming.imageStringProcessor(
    tv.imageLink
  )});">
  <div class="upcoming-date">
      <div class="upcoming-date__date">
          <div class="upcoming-date__month">
          ${upcoming.dateStringProcessor(tv.showDate).month.toUpperCase()}
          </div>
          <div class="upcoming-date__day">
          ${upcoming.dateStringProcessor(tv.showDate).day}
          </div>
      </div>
      <div class="upcoming-date__time">${tv.showTime}</div>
  </div>
  <div class="upcoming-show-content">
      <div class="upcoming-show-info">
          <div class="upcoming-show-name">${tv.showName}</div>
          <div class="upcoming-episode-name">-${tv.episodeName}</div>
      </div>
      <div class="upcoming-network">${tv.networkName}</div>
  </div>
</div>
  `;
  return html;
};

// render content loader element for trending see more
const renderContent = function (tvShowData) {
  const upcomingTVBlockEl = document.querySelector(".upcoming-tv-content");

  const seeMoreDivEl = document.createElement("div");
  seeMoreDivEl.classList = "upcoming-more-card-div";

  // appending the whole see more section
  upcomingTVBlockEl.append(seeMoreDivEl);

  // render for each one, since this the actual tv data
  tvShowData.forEach((tv) => {
    const itemHtml = renderItemHtml(tv);
    seeMoreDivEl.insertAdjacentHTML("beforeend", itemHtml);
  });
};

// Manage upcoming see more option
const expandBtn = function (tvShowData) {
  let seeMoreDivEl = document.querySelector(".upcoming-more-card-div");
  const seeMoreBtn = document.querySelector(
    ".upcoming-tv-title .expand-toggle"
  );

  if (!expanded) {
    // If the see more trending tv element has not yet generated
    if (!seeMoreDivEl) {
      renderContent(tvShowData);
      expanded = true;
      hideUnhideUpcomingTV();
      seeMoreBtn.innerHTML = trending.expandOrCollpaseBtnsHtml(expanded);
    } else {
      // upcoming more tv shows have been generated, so no need to generate again, set display
      seeMoreDivEl.style.display = "grid";
      expanded = true;
      hideUnhideUpcomingTV();
      seeMoreBtn.innerHTML = trending.expandOrCollpaseBtnsHtml(expanded);
    }
  } else {
    // hide all the upcoming see more items if the button clicked was to collpase them
    seeMoreDivEl = document.querySelector(".upcoming-more-card-div");
    seeMoreDivEl.style.display = "none";
    expanded = false;
    hideUnhideUpcomingTV();
    seeMoreBtn.innerHTML = trending.expandOrCollpaseBtnsHtml(expanded);
  }
};

// toggle hide and unhide the upcoming tv elements
const hideUnhideUpcomingTV = function () {
  const upcomingTVEl = document.querySelector(".upcoming-cards");
  upcomingTVEl.classList.toggle("hide-it");
};

export default {
  expandBtn,
};
