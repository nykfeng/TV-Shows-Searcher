const TVShows = async function (searchQuery) {
  const res = await fetch(
    `https://api.tvmaze.com/search/shows?q=${searchQuery}`
  );
  const data = await res.json();
  return data;
};

const localServerTrending = async function (pageQuery) {
  if (!pageQuery) {
    const res = await fetch(`./trendingList.json`);
    const data = await res.json();
    return data;
  } else {
    const res = await fetch(`./moreTrendingList.json`);
    const data = await res.json();
    return data;
  }
};

const localServerUpcoming = async function (page) {
  if (page === 1) {
    const res = await fetch(`./upcomingList.json`);
    const data = await res.json();
    return data;
  } else {
    const res = await fetch(`./moreUpcomingList.json`);
    const data = await res.json();
    return data;
  }
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
  TVShowByCode,
  TVShowCast,
  peopleByCode,
  TVShowByCodeEmbeddedCast,
  localServerTrending,
  localServerUpcoming,
};
