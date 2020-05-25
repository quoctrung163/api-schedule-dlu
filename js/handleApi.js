const fetch = require("node-fetch");
const { Headers } = require("node-fetch");
const tabletojson = require("tabletojson").Tabletojson;

const fs = require("fs");
const path = require("path");

require("dotenv").config();

const myHeaders = new Headers();

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth();

myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
myHeaders.append("Cookie", "ASP.NET_SessionId=ma0grj5mid5dxv0yem1spbvc");

const urlencoded = new URLSearchParams();
urlencoded.append("txtTaiKhoan", process.env.ID);
urlencoded.append("txtMatKhau", process.env.PassWord);

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: urlencoded,
  redirect: "follow"
};

var yearStudy = "";
var termID = "";
var week = "";

const getYearAndTermStudy = () => {
  if (
    (month === 0) |
    (month === 1) |
    (month === 2) |
    (month === 3) |
    (month === 4) |
    (month === 5) |
    (month === 6)
  ) {
    yearStudy = `${year - 1}-${year}`;
    termID = `HK02`;
  } else if (month === 7) {
    yearStudy = `${year - 1}-${year}`;
    termID = `HK03`;
  } else {
    console.log(`${year}-${year + 1}`);
    yearStudy = `${year}-${year + 1}`;
    termID = `HK01`;
  }
};

const getWeek = () => {
  let onejan = new Date(date.getFullYear(), 0, 1);
  week = Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7);
};

getYearAndTermStudy();
getWeek();

async function postLogin(url, config) {
  await fetch(url, config)
    .then(response => response.text())
    .catch(error => console.log(error));
}

async function getHTML(url, config) {
  await fetch(url, config)
    .then(response => response.text())
    .then(result => {
      fs.writeFileSync("index.html", result, "utf8", function(err) {
        if (err) throw err;
        else console.log("Ghi file thanh cong!");
      });
      // console.log(result);
    })
    .catch(error => console.log(error));
}

async function getSchedule() {
  const fileIndexHTML = await fs.readFileSync(
    path.resolve(__dirname, "../index.html"),
    { encoding: "UTF-8" }
  );
  let tablesAsJson = await tabletojson.convert(fileIndexHTML, {
    useFirstRowForHeadings: true
  });
  let result = await tablesAsJson[0];
  // console.log(result);
  return result;
}

async function getAPI(studentID) {
  let url = await `http://online.dlu.edu.vn/Home/DrawingStudentSchedule?StudentId=${Number(
    studentID
  )}&YearId=${yearStudy}&TermId=${termID}&WeekId=${week}`;

  let urlLogin = await `http://online.dlu.edu.vn/Login`;
  await postLogin(urlLogin, requestOptions);
  await getHTML(url, requestOptions);
  await getSchedule();
}

module.exports = {
  getAPI: getAPI,
  getSchedule: getSchedule
};
