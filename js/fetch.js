const TVShows = async function (searchQuery) {
  const res = await fetch(
    `https://api.tvmaze.com/search/shows?q=${searchQuery}`
  );
  const data = await res.json();
  return data;
};

const trendingTV = async function () {
  const url =
    "https://cors-anywhere.herokuapp.com/https://www.tvmaze.com/shows";
  const config = {
    headers: { "Access-Control-Allow-Origin": "*" },
  };

  const response = await axios.get(url, config);
  const html = await response.data;
  return html;
};

const TVShowCast = async function (tvShowCode) {
  const url = `https://api.tvmaze.com/shows/${tvShowCode}/cast`;

  const data = await axios.get(url);
  return data;
};

const TVShowByCode = async function (tvShowCode) {
  const url = `https://api.tvmaze.com/shows/${tvShowCode}`;

  const data = await axios.get(url);
  return data;
};

const peopleByCode = async function (castId) {
  const url = `https://api.tvmaze.com/people/${castId}?embed=castcredits`;

  const data = await axios.get(url);
  return data;
};

const TVShowByCodeEmbeddedCast = async function (tvShowCode) {
  const url = `https://api.tvmaze.com/shows/${tvShowCode}?embed=cast`;

  const data = await axios.get(url);
  return data;
};

export default {
  TVShows,
  trendingTV,
  TVShowByCode,
  TVShowCast,
  peopleByCode,
  TVShowByCodeEmbeddedCast,
};
