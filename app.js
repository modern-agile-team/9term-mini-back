"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes/index");
const session = require("express-session");

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

//Session Middle Ware
app.use(
  session({
    secret: "InstsargramUserKey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", router);

module.exports = app;
