"use strict";

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const router = require("./routes/index");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const isAuthenticated = require("./middlewares/auth"); // 로그인 여부 미들웨어 함수

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL 세션 스토어 옵션
const options = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_DATABASE,
  createDatabaseTable: true,
};

// MySQL 세션 스토어 생성
const sessionStore = new MySQLStore(options);

app.use(
  session({
    key: "session_cookie_name",
    secret: process.env.SESSION_SECRET || "instargramuserkey",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "development", // production 환경에서만 secure 쿠키 사용
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 24시간
    },
  })
);

app.use("/", router);

module.exports = app;
