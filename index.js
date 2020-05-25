const express = require("express");
const bodyparser = require("body-parser");
const { getAPI } = require("./js/handleApi");
const { getSchedule } = require("./js/handleApi");
const http = require('http');
require("dotenv").config();

const port = 8000;
const app = express();

app.use(bodyparser.json());

app.get("/", async (req, res) => {
  console.log(req.query.studentID);
  console.log(Date.now() + " Ping Received");
  await getAPI(req.query.studentID);
  let data2 = await getSchedule();
  res.json(data2);
});

app.listen(port, () => {
  console.log(`Server running at http://${port}/`);
});

setInterval(() => {
	console.log("Tự động làm mới sau 5p");
  http.get(`http://future-attractive-rambutan.glitch.me/`);
}, 280000);
