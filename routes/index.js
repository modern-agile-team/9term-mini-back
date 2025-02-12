"use strict";

const express = require("express");

const router = express.Router();
const userCtrl = require("../controllers/user");
const isAuthenticated = require("../middlewares/auth"); // 로그인 여부 미들웨어 함수

// router.get("/api/posts", isAuthenticated, ctrl.post);
router.get("/api/login", userCtrl.login);

router.post("/api/register", userCtrl.register);
router.post("/api/logout", userCtrl.logout);

module.exports = router;
