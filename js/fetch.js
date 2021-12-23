const TVShows = async function (searchQuery) {
  const res = await fetch(
    `https://api.tvmaze.com/search/shows?q=${searchQuery}`
  );
  const data = await res.json();
  return data;
};

// const trendingTV = async function () {
//   const url =
// };

export default {
  TVShows,
};
