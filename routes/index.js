"use strict";

const express = require("express");
const router = express.Router();
const { signup } = require("../controllers/auth.ctrl");

router.post("/api/signup", signup);

module.exports = router;