import express from "express";
import * as fs from "fs";
import getList from "./server-js/getList.js";

const PORT = process.env.PORT || 5080;

const app = express();

const indexPage = fs.readFileSync(`./index.html`, "utf-8");

app.use(express.static("./"));

app.get("/", (req, res) => {
  console.log("Got a request! Now sending the index page.");

  res.send(indexPage);
});

app.get("/trendingList.json", async (req, res) => {
  const listData = await getList.trendingTV();
  console.log("Accessed trending TV from server side");

  res.send(listData);
});

app.get("/moreTrendingList.json", async (req, res) => {
  const listData = await getList.trendingTV('?page=2');
  console.log("Accessed more trending TV from server side");

  res.send(listData);
});

app.get("/upcomingList.json", async (req, res) => {
  const listData = await getList.upcomingTV();
  console.log("Accessed upcoming TV from server side");

  res.send(listData);
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
