"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes/index");

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", router);

module.exports = app;
