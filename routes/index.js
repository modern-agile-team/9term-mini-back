"use strict";

const express = require("express");
const session = require("express-session");
const router = express.Router();

const ctrl = require("./home.ctrl");

//session Middle Ware
router.use(
  session({
    secret: "InstsargramUserKey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

router.get("/", (req, res, next) => {
  res.render("index");
});
router.get("/api/login", (req, res, next) => {
  res.render("login");
});

router.post("/api/login", ctrl.login);

module.exports = router;
