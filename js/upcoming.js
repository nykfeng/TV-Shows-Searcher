import trending from "./trending.js";

const renderOnScheduleElements = function (upcomingTVList) {
  const upcomingTVContentEl = document.querySelector(".upcoming-tv-content");

  // Add the title bar element
  const upcomingTVTitleEl = document.createElement("div");
  upcomingTVTitleEl.classList = "upcoming-tv-title";
  // upcomingTVTitleEl.textContent = "📆Upcoming Season Premieres";
  upcomingTVTitleEl.innerHTML = `<p class="upcoming-tv-title-text">📆Upcoming Season Premieres</p><div class="expand-toggle">
    ${trending.expandOrCollpaseBtnsHtml(false)}</div>`;

  upcomingTVContentEl.append(upcomingTVTitleEl);

  // Add the upcoming tv cards section element
  const upcomingCardsEl = document.createElement("div");
  upcomingCardsEl.classList = "upcoming-cards";
  upcomingTVContentEl.append(upcomingCardsEl);

  // Set it to 8 on main page, more can be seen with "See More"
  const NUMBER_OF_UPCOMING_TV = 8;

  // Loop through the upcoming tv list
  upcomingTVList.forEach((tv, i) => {
    if (i < NUMBER_OF_UPCOMING_TV) {
      const html = `
      <div class="upcoming-card" data-show-id="${
        tv.showId
      }" style="background-image: url(${imageStringProcessor(tv.imageLink)});">
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
          <div class="upcoming-show-name">${tv.showName}</div>
          <div class="upcoming-episode-name">-${tv.episodeName}</div>
          <div class="upcoming-network">
              ${tv.networkName}
          </div>
      </div>

    </div>
        `;
      upcomingCardsEl.insertAdjacentHTML("beforeend", html);
    }
  });

  // Display the number of upcoming tv show cards based on view port width
  displayUpcomingCards();
};

const dateStringProcessor = function (dateStr) {
  dateStr = dateStr.substring(0, dateStr.indexOf(","));
  const month = dateStr.substring(0, dateStr.indexOf(" "));
  const day = dateStr.substring(dateStr.indexOf(" "), dateStr.length);
  return { month, day };
};

const imageStringProcessor = function (imageLink) {
  return (
    imageLink.replace("medium_portrait", "original_untouched") ||
    imageLink ||
    ""
  );
};

const calculateNumberOfUpcomingCards = function () {
  const windowWidth = window.innerWidth;
  let numberOfCardsToDisplay = 1; //Default it to 1
  if (windowWidth <= 600) {
    numberOfCardsToDisplay = 1;
  } else if (windowWidth > 600 && windowWidth <= 900) {
    numberOfCardsToDisplay = 2;
  } else if (windowWidth > 900 && windowWidth <= 1100) {
    numberOfCardsToDisplay = 3;
  } else if (windowWidth > 1100 && windowWidth <= 1500) {
    numberOfCardsToDisplay = 4;
  } else if (windowWidth > 1500 && windowWidth <= 1800) {
    numberOfCardsToDisplay = 5;
  } else if (windowWidth > 1800 && windowWidth <= 2100) {
    numberOfCardsToDisplay = 6;
  } else {
    numberOfCardsToDisplay = 8;
  }

  return numberOfCardsToDisplay;
};

const hideAllUpcomingCards = function () {
  const allUpcomingCards = document.querySelectorAll(
    ".upcoming-cards .upcoming-card"
  );
  allUpcomingCards.forEach((card) => {
    if (!card.classList.contains("hide-it")) {
      card.style.display = "none";
    }
  });
};

const UnhideCards = function (numberOfCards) {
  const allUpcomingCards = document.querySelectorAll(
    ".upcoming-cards .upcoming-card"
  );
  allUpcomingCards.forEach((card, i) => {
    if (i < numberOfCards) {
      card.style.display = "flex";
    }
  });
};

const displayUpcomingCards = function () {
  hideAllUpcomingCards();
  const numberToDisplay = calculateNumberOfUpcomingCards();
  UnhideCards(numberToDisplay);
};

// Adjust the number of upcoming tv show cards to display based on the size of the screen
window.addEventListener("resize", displayUpcomingCards);

export default {
  renderOnScheduleElements,
  imageStringProcessor,
  dateStringProcessor,
};
