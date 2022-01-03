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

const upcomingTV = async function () {
  const url =
    "https://www.tvmaze.com/countdown?filter=season&source=country-US";
  const response = await axios(url);
  const html = await response.data;
  const $ = cheerio.load(html);

  const upcomingTVLists = [];

  $("article", html).each(function () {
    const imageLink = $(this).find("a img").attr("src");
    const showDateStr = $(this).find("header .airtime").text();
    const { showDate, showTime } = getDateString(showDateStr);
    const showName = $(this).find(".show-name a").text();
    const episodeName = $(this).find(".episode-name a").text();
    const networkName = $(this).find("section div:nth-child(3) a").text();
    const showIdStr = $(this).find("section div:nth-child(1) a").attr("href");
    const showId = getShowIdFromStr(showIdStr);

    upcomingTVLists.push({
      imageLink,
      showDate,
      showTime,
      showName,
      episodeName,
      networkName,
      showId,
    });
  });

  return upcomingTVLists;
};

const getDateString = function (dateStr) {
  const showDate = dateStr.substring(0, dateStr.indexOf(" at"));
  const showTime = dateStr.substring(dateStr.indexOf("at") + 3, dateStr.length);
  return { showDate, showTime };
};

const getShowIdFromStr = function (showIdStr) {
  showIdStr = showIdStr.replace("/shows/", "");
  const showId = showIdStr.substring(0, showIdStr.indexOf("/"));

  return showId;
};

export default {
  trendingTV,
  upcomingTV,
};
