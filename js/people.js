import fetch from "./fetch.js";

const renderPeopleDetails = async function (castId) {
  const peopleData = await fetch.peopleByCode(castId);

  const resultAreaEl = document.querySelector(".result-area");
  // remove any already existed elements inside

  const peopleSectionEl = document.createElement("div");
  peopleSectionEl.classList = "people-information";
  resultAreaEl.append(peopleSectionEl);
  peopleSectionEl.insertAdjacentHTML("afterbegin", peopleHeaderTitleElement());

  const peopleInfoDetailEl = document.createElement("div");
  peopleInfoDetailEl.classList = "people-info-details";
  peopleSectionEl.append(peopleInfoDetailEl);

  peopleInfoDetailEl.insertAdjacentHTML(
    "afterbegin",
    peopleInfoDetail(peopleData)
  );

  const filmographyContainerEl = document.createElement("div");
  filmographyContainerEl.classList = "filmography-container";
  peopleInfoDetailEl.append(filmographyContainerEl);

  const peopleName = peopleData.data.name;

  // Keep the filmography to show at max at 8.
  const numberOfFilmography =
    peopleData.data._embedded.castcredits.length > 8
      ? 8
      : peopleData.data._embedded.castcredits.length;

  // needs a loop
  peopleData.data._embedded.castcredits.forEach(async (filmographyData, i) => {
    if (i < numberOfFilmography) {
      // rendering each filmography, then add it to the container
      filmographyContainerEl.insertAdjacentHTML(
        "beforeend",
        await otherFilmography(filmographyData, peopleName)
      );
    }
  });

  const closePeopleDetailsBtn = document.querySelector(
    ".people-info-collapse-btn"
  );
  closePeopleDetailsBtn.addEventListener("click", function () {
    peopleSectionEl.remove();
  });
};

const peopleHeaderTitleElement = function () {
  const html = `
  <div class="people-info-title-bar">
  <div class="people-info-title-text">
      Actor Information & Filmography
  </div>
  <button class="people-info-collapse-btn">
      X
  </button>
</div>
    `;
  return html;
};

const peopleInfoDetail = function (data) {
  const html = `
    <div class="people-info-details-box">
                    <img src="${data.data.image.original}" alt="${
    data.data.name
  }"
                        class="people-portrait">
                    <div class="people-info-text">
                        <p class="people-info-text-title">Person Info</p>
                        <p class="people-name"><span>Name: </span>${
                          data.data.name
                        }</p>
                        <p class="people-gender"><span>Gender: </span>${
                          data.data.gender
                        }</p>
                        <p class="people-age"><span>Age: </span>${calculateAge(
                          data.data.birthday
                        )}</p>
                        <p class="people-DOB"><span>Birthday: </span>${
                          data.data.birthday
                        }</p>
                        <p class="people-nationality"><span>Nationality: </span>${
                          data.data?.country?.name
                        }</p>
                    </div>
                </div>
    `;
  return html;
};

const calculateAge = function (dob) {
  const birthday = new Date(dob);
  const today = new Date();

  return Math.floor((today - birthday) / 1000 / 60 / 60 / 24 / 365);
};

const otherFilmography = async function (data, name) {
  const showId = getShowIdFromPeopleInfoAPI(data); // data passed in here only to get the show ID
  const showInfo = await fetch.TVShowByCodeEmbeddedCast(showId); // Now we got the show info along with embedded cast
  const characterInfo = getCharacterInfo(showInfo.data._embedded.cast, name);

  const html = `
  <div class="people-other-shows">
  <div class="other-shows-box">
      <div class="other-show-poster-title">
          <img src="${showInfo.data.image?.medium || ""}" alt="${name}"
              class="other-show-poster">
          <div class="other-show-title">${
            showInfo.data.name
          } (${calculatePremierYear(showInfo.data.premiered)})</div>
      </div>
      <div class="other-show-character-portrait-div">
          <div><span>As</span> <span class="other-show-character-name">${
            characterInfo.characterName
          }</span>
          </div>
          <img src="${characterInfo.characterPortraitUrl}" alt="${
    characterInfo.characterName
  }"
              class="other-show-portrait">
      </div>


  </div>
</div>
    `;
  return html;
};

const getShowIdFromPeopleInfoAPI = function (data) {
  const showURL = data._links.show.href;
  const showId = showURL.substring(
    showURL.lastIndexOf("/") + 1,
    showURL.length
  );
  return showId;
};

const calculatePremierYear = function (date) {
  const premiered = new Date(date);
  return premiered.getFullYear();
};

const getCharacterInfo = function (data, name) {
  // data will be _embedded.cast array
  let characterInfo = { characterName: "", characterPortraitUrl: "" };
  data.forEach((cast) => {
    // console.log(cast);
    if (cast.person.name === name) {
      characterInfo.characterName = cast.character.name;
      characterInfo.characterPortraitUrl =
        cast.character.image?.medium || cast.person.image?.medium;
    }
  });
  return characterInfo;
};

export default {
  renderPeopleDetails,
};
