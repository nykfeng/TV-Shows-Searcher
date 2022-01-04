// Create the html elements for More Details page
const renderMoreDetailsElements = function (tv) {
  const imdbLink = `https://www.imdb.com/title/${tv.show?.externals?.imdb}`;
  const tvrageLink = `https://www.tvrage.com/title/${tv.show?.externals?.tvrage}`;
  const thetvdbLink = `https://www.thetvdb.com/search?query=${tv.show?.externals?.thetvdb}`;
  const html = `
      <div class="more-details">
              <div class="poster">
                  <img class="poster-image" src="${tv.show?.image?.original}"
                      alt="${tv.show?.name} poster">
              </div>
              <div class="tv-show-info">
                  <div class="info-title">
                    <div>🎬TV Show Information</div>
                    <button class="close-btn">X</button>
                  </div>
                  <div class="name">Name: <span>${tv.show?.name}</span></div>
                  <div class="genre">Genres: <span>${
                    tv.show?.genres.join(", ") || "Various"
                  }</span></div>
                  <div class="runtime">Runtime: <span>${
                    tv.show?.runtime || "Various"
                  }</span></div>
                  <div class="premiered">Premiered on: <span>${
                    tv.show?.premiered || "Unknown"
                  }</span></div>
                  <div class="ended">Ended on: <span>${
                    tv.show?.ended || "Still running"
                  }</span></div>
                  <div class="official-site">Official site: <a class="external-link-official" href="${
                    tv.show?.officialSite
                  }"><i class="fas fa-external-link-alt"></i></a></div>
                  <div class="ratings">Rating: <span>${
                    tv.show?.rating?.average || "No"
                  }</span>⭐</div>
              </div>
              <div class="tv-show-details">
                  <div class="details-title">🎬Details</div>
                  <div class="country">Country: <span>${
                    tv.show?.network?.country?.name ||
                    tv.show?.webChannel?.country?.name ||
                    "Various"
                  }</span></div>
                  <div class="language">Language: <span>${
                    tv.show?.language || "Unknown"
                  }</span></div>
                  <div class="network">Network: <span>${
                    tv.show?.network?.name ||
                    tv.show?.webChannel?.name ||
                    "Various"
                  }</span></div>
                  <div class="summary">Summary: <span class=summary-text>${
                    tv.show?.summary || ""
                  }</span></div>
              </div>
              <div class="external-links-div">
                  <div>More on: </div>
                  <div class="imdb-links"><a class="external-link external-link-imdb" href="${imdbLink}"></a></div>
                  <div class="tvrage"><a class="external-link external-link-tvrage" href="${tvrageLink}"></a></div>
                  <div class="thetvdb"><a class="external-link external-link-thetvdb" href="${thetvdbLink}"></a></div>
              </div>
              <div class="tv-show-cast">
                <div class="cast-title">
                <p class="cast-title-text">🎬Cast</p>
                <button class="cast-title-dropdown"><i class="fas fa-chevron-circle-down"></i></button>
                
                </div>
  
  
              </div>
          </div>
      `;
  return html;
};

export default {
  renderMoreDetailsElements,
};
