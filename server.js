import express from "express";
import * as fs from "fs";
import getList from "./server-js/getList.js";

const PORT = process.env.PORT || 5080;

const app = express();

const indexPage = fs.readFileSync(`./index.html`, "utf-8");

app.use(express.static("./"));

app.get("/", (req, res) => {
  console.log("Got your request and now rendering page");

  res.send(indexPage);
});

app.get("/list.json", async (req, res) => {
  const listData = await getList.trendingTV();
  console.log("get the list from server side scraping");

  res.send(listData);
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
