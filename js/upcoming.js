const renderUpcomingElements = function (upcomingTVList) {
  const upcomingTVContentEl = document.querySelector(".upcoming-tv-content");

  // Add the title bar element
  const upcomingTVTitleEl = document.createElement("div");
  upcomingTVTitleEl.classList = "upcoming-tv-title";
  upcomingTVTitleEl.textContent = "📆Upcoming TV Schedule";
  upcomingTVContentEl.append(upcomingTVTitleEl);

  // Add the upcoming tv cards section element
  const upcomingCardsEl = document.createElement("div");
  upcomingCardsEl.classList = "upcoming-cards";
  upcomingTVContentEl.append(upcomingCardsEl);

  // Set it to 10 on main page, more can be seen with "See More"
  const NUMBER_OF_UPCOMING_TV = 10;

  // Loop through the upcoming tv list
  upcomingTVList.forEach((tv, i) => {
    if (i < NUMBER_OF_UPCOMING_TV) {
      console.log(tv.imageLink);
      const html = `
      <div class="upcoming-card" data-show-id="${
        tv.showId
      }" style="background-image: url(${tv.imageLink});">
        <div class="upcoming-date">
          <div class="upcoming-date__date">
              <div class="upcoming-date__month">
                  ${dateStringProcessor(tv.showDate).month.toUpperCase()}
              </div>
              <div class="upcoming-date__day">
                ${dateStringProcessor(tv.showDate).day}
              </div>

          </div>
          <div class="upcoming-date__time">${tv.showTime}</div>
      </div>
      <div class="upcoming-show-content">
          <div class="upcoming-show-name"><a href="#">${tv.showName}</a></div>
          <div class="upcoming-episode-name">-${tv.episodeName}</div>
          <div class="upcoming-network">
              <span>by</span>
              ${tv.networkName}
          </div>
      </div>

    </div>
        `;
      upcomingCardsEl.insertAdjacentHTML("beforeend", html);
    }
  });
};

const dateStringProcessor = function (dateStr) {
  dateStr = dateStr.substring(0, dateStr.indexOf(","));
  const month = dateStr.substring(0, dateStr.indexOf(" "));
  const day = dateStr.substring(dateStr.indexOf(" "), dateStr.length);
  return { month, day };
};

export default {
  renderUpcomingElements,
};
