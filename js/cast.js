import fetch from "./fetch.js";

const renderInDetails = async function (tvShowCode) {
  const castData = await fetch.TVShowCast(tvShowCode);

  const tvShowCastEl = document.querySelector(".tv-show-cast");
  const tvShowCastGridEl = document.createElement("div");
  tvShowCastGridEl.classList = "tv-show-cast-grid";
  tvShowCastEl.append(tvShowCastGridEl);

  const numberOfCast = castData.data.length >= 8 ? 8 : castData.data.length;
  if (numberOfCast === 0) {
    return;
  }

  castData.data.forEach((data, i) => {
    if (i < numberOfCast) {
      const html = `
    <div class="cast-list">
        <div class="cast-list-individual-box">
        <img src="${data.character.image?.medium}" alt="${data.character.name}"
            class="portrait-in-show">
        <div class="cast-list-individual-details">
            <p class="character-name">${data.character.name}</p>
            <div class="cast-name-div">
                <span>by</span>
                <p class="cast-name" data-cast-id="${data.person.id}"">${data.person.name}</p>
            </div>
            <img src="${data.person.image?.medium}" alt="${data.person.name}"
                class="portrait-real">
        </div>
        </div>
    </div>
      `;
      tvShowCastGridEl.insertAdjacentHTML("beforeend", html);
    }
  });
};

export default {
  renderInDetails,
};
