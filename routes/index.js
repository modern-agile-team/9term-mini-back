"use strict";

const express = require("express");

const router = express.Router();
const ctrl = require("../controllers/logout.ctrl");
const isAuthenticated = require("../middlewares/auth"); // 로그인 여부 미들웨어 함수

// router.get("/api/posts", isAuthenticated, ctrl.post);
router.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "user" && password === "password") {
    req.session.user = { username };
    res.json({ message: "로그인 성공", user: { username } });
  } else {
    res.status(401).json({ message: "로그인 실패" });
  }
});

router.post("/api/logout", ctrl.logout);

module.exports = router;
