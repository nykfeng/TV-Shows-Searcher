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
  for (let i = startIndex; i < startIndex + numberOfCards; i++) {
    allCards[i];
  }
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

export default {
  hideAllCards,
  resetCards,
  rightBtnActions,
  leftBtnActions,
};