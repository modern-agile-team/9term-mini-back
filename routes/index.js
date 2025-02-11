"use strict";

const express = require("express");
const router = express.Router();

const ctrl = require("./home.ctrl");

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/api/login", (req, res, next) => {
  req.session.username = "user123";
  res.send("Login Successful");
});

router.post("/api/login", ctrl.login);

module.exports = router;
