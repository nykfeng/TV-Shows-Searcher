import axios from "axios";
import cheerio from "cheerio";

const trendingTV = async function () {
  const url = "https://www.tvmaze.com/shows";
  const response = await axios(url);
  const html = await response.data;
  const $ = cheerio.load(html);

  const tvShowCodes = [];
  $(".column-block", html).each(function () {
    tvShowCodes.push($(this).attr("data-key"));
  });

  return tvShowCodes;
};

export default {
  trendingTV,
};
