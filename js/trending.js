let currentFirst = 1;
let numberToDisplay = 1;
let totalNumberOfCards;
let allCards;

const resetCards = function () {
  hideAllCards(); // must be first here so that totalNumberOfCards and allCards are initialized
  numberToDisplay = calculateNumberOfTVShowCards();
  hideAndUnhideCards(numberToDisplay, 1); // As it is reset, so the first index is 1
};

const hideAllCards = function () {
  allCards = document.querySelectorAll(".trending-card");
  allCards.forEach((card) => {
    card.classList.add("hide-it");
  });
  totalNumberOfCards = allCards.length;
};

const hideAndUnhideCards = function (numberOfCards, startIndex) {
  // for (let i = startIndex; i < startIndex + numberOfCards; i++) {
  //   allCards[i];
  // }
  const endIndex = startIndex + numberOfCards;
  allCards.forEach((card) => {
    if (startIndex < endIndex) {
      if (card.classList.contains(`slider-${startIndex}`)) {
        card.classList.remove("hide-it");
        startIndex++;
      }
    }
  });
};

// For actions after left button is fire
const leftBtnActions = function () {
  if (currentFirst === 1) {
    return;
  } else {
    currentFirst--;
    let newSliderNumber = currentFirst + numberToDisplay;
    if (newSliderNumber > totalNumberOfCards) {
      return;
    }

    const currentCardEl = document.querySelector(`.slider-${currentFirst}`);
    currentCardEl.classList.remove("hide-it");
    const newCardEl = document.querySelector(`.slider-${newSliderNumber}`);
    newCardEl.classList.add("hide-it");
  }
};

// For actions after right button is fire
const rightBtnActions = function () {
  if (currentFirst + numberToDisplay - 1 === totalNumberOfCards) {
    return;
  }

  let newSliderNumber = currentFirst + numberToDisplay;
  if (newSliderNumber > totalNumberOfCards) {
    newSliderNumber = newSliderNumber % totalNumberOfCards;
  }

  //first card add classlist hide-it,

  const currentCardEl = document.querySelector(`.slider-${currentFirst}`);
  currentCardEl.classList.add("hide-it");

  const newCardEl = document.querySelector(`.slider-${newSliderNumber}`);
  newCardEl.classList.remove("hide-it");

  // This has to be after the new card number was taken
  currentFirst++;
};

const displayTVShowCards = function () {
  hideAllCards();
  numberToDisplay = calculateNumberOfTVShowCards();

  if (currentFirst > totalNumberOfCards) {
    return;
  }
  if (currentFirst > totalNumberOfCards - numberToDisplay) {
    currentFirst = totalNumberOfCards - numberToDisplay + 1;
  }
  hideAndUnhideCards(numberToDisplay, currentFirst);
};

// Adjust the number of tv show cards to display based on the size of the screen
window.addEventListener("resize", displayTVShowCards);

function calculateNumberOfTVShowCards() {
  const windowWidth = window.innerWidth;
  let numberOfCardsToDisplay = 1; //Default it to 1
  if (windowWidth <= 900) {
    numberOfCardsToDisplay = 1;
  } else if (windowWidth > 900 && windowWidth <= 1400) {
    numberOfCardsToDisplay = 2;
  } else if (windowWidth > 1400 && windowWidth <= 1800) {
    numberOfCardsToDisplay = 3;
  } else if (windowWidth > 1800 && windowWidth <= 2300) {
    numberOfCardsToDisplay = 4;
  } else {
    numberOfCardsToDisplay = 5;
  }

  return numberOfCardsToDisplay;
}

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

const renderSliderLeftBtnElements = function () {
  const html = `<button class="slider-button left-slider-btn"><i class="fas fa-chevron-left"></i></button>`;
  return html;
};

const renderSliderRightBtnElements = function () {
  const html = `<button class="slider-button right-slider-btn"><i class="fas fa-chevron-right"></i></button>`;
  return html;
};

// Create trending / popular section content placeholder html
const renderPlaceholderElements = function () {
  const mainDisplayEl = document.querySelector(".main-display-content");

  // create the div element to hold all of trending tv
  const trendingTVDivEl = document.createElement("div");
  trendingTVDivEl.classList = "trendingTV";

  // create the section title element
  const trendingTVDivTitleEl = document.createElement("div");
  trendingTVDivTitleEl.classList = "trending-title";
  // trendingTVDivTitleEl.textContent = "📡Trending/Popular TV";
  trendingTVDivTitleEl.innerHTML =
    `<p class="trending-title-text">📡Trending/Popular TV</p>` +
    expandOrCollpaseBtnsHtml(false);
  mainDisplayEl.append(trendingTVDivTitleEl);

  // render the left slider button
  trendingTVDivTitleEl.insertAdjacentHTML(
    "afterend",
    renderSliderLeftBtnElements()
  );
  mainDisplayEl.insertAdjacentHTML("beforeend", renderSliderRightBtnElements());

  mainDisplayEl.append(trendingTVDivEl);
  // create the div element to hold placeholder content
  const trendingTVPlaceholderEl = document.createElement("div");
  trendingTVPlaceholderEl.classList = "trending-card-placeholder-section";
  trendingTVDivEl.append(trendingTVPlaceholderEl);

  const numberOfCards = calculateNumberOfTVShowCards();
  for (let i = 0; i < numberOfCards; i++) {
    trendingTVPlaceholderEl.insertAdjacentHTML(
      "beforeend",
      tvshowCardPlaceholderHtml()
    );
  }
};

// Create the trending tv more buttons, expand and collpase
const expandOrCollpaseBtnsHtml = function (expanded) {
  if (expanded) {
    return `<button class="trending-title-expand"><i class="far fa-caret-square-up"></i><span class="see-more-text">Less</span></button>
    `;
  } else {
    return `<button class="trending-title-expand"><i class="far fa-caret-square-down"></i><span class="see-more-text">More</span></button>
    `;
  }
};

// Create trending tv show card placeholder elements
const tvshowCardPlaceholderHtml = function () {
  const html = `
    <div class="trending-card">
      <div class="content-placeholder-img animated-bg">&nbsp;</div>
      <div class="content-placeholder-text animated-bg">&nbsp;</div>
      <div class="content-placeholder-text animated-bg">&nbsp;</div>
    </div>
  `;
  return html;
};

// Render the whole trending / popular section html element and return it
const renderTrendingElements = function (trendingListOfTVToRender) {
  // const mainDisplayEl = document.querySelector(".main-display-content");

  // const trendingTVDivEl = document.createElement("div");
  // trendingTVDivEl.classList = "trendingTV";
  // const trendingTVDivTitleEl = document.createElement("div");
  // trendingTVDivTitleEl.classList = "trending-title";
  // trendingTVDivTitleEl.textContent = "📡Trending/Popular TV";

  // mainDisplayEl.append(trendingTVDivTitleEl);
  // trendingTVDivTitleEl.insertAdjacentHTML(
  //   "afterend",
  //   renderSliderLeftBtnElements()
  // );

  const trendingTVDivEl = document.querySelector(".trendingTV");

  // remove the placeholder content
  const trendingTVPlaceholderContentEl = document.querySelector(
    ".trending-card-placeholder-section"
  );
  trendingTVPlaceholderContentEl.remove();

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
                <img class="front-image" data-show-id='${tv.showInfo.data.id}'
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
                        <img src="${tv.cast["0"].person.image.medium}" alt="${
      tv.cast["0"].person.name
    }"
                            class="trending-cast-img">
                        <img src="${tv.cast["1"].person.image.medium}" alt="${
      tv.cast["1"].person.name
    }"
                            class="trending-cast-img">
                        <img src="${tv.cast["2"].person.image.medium}" alt="${
      tv.cast["2"].person.name
    }"
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
                        <img src="${tv.cast["0"].person.image.medium}" alt="${
      tv.cast["0"].person.name
    }"
                            class="trending-cast-img">
                        <p class="trending-cast-name" data-cast-id='${
                          tv.cast["0"].person.id
                        }'>${tv.cast["0"].person.name}</p>
                    </div>
                    <div class="trending-cast-detail">
                        <img src="${tv.cast["1"].person.image.medium}" alt="${
      tv.cast["1"].person.name
    }"
                            class="trending-cast-img">
                        <p class="trending-cast-name" data-cast-id='${
                          tv.cast["1"].person.id
                        }'>${tv.cast["1"].person.name}</p>
                    </div>
                    <div class="trending-cast-detail">
                        <img src="${tv.cast["2"].person.image.medium}" alt="${
      tv.cast["2"].person.name
    }"
                            class="trending-cast-img">
                        <p class="trending-cast-name" data-cast-id='${
                          tv.cast["2"].person.id
                        }'>${tv.cast["2"].person.name}</p>
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
  // mainDisplayEl.insertAdjacentHTML("beforeend", renderSliderRightBtnElements());

  return trendingTVDivEl;
};

export default {
  hideAllCards,
  resetCards,
  rightBtnActions,
  leftBtnActions,
  scaleTitleTextToFit,
  renderTrendingElements,
  renderPlaceholderElements,
  expandOrCollpaseBtnsHtml,
};
