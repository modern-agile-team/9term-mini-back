"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes/index");
const session = require("express-session");
const isAuthenticated = require("./middlewares/auth"); // 로그인 여부 미들웨어 함수

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "인스타클론비밀키",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use("/", router);

module.exports = app;
