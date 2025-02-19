"use strict";

const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const postCtrl = require("../controllers/post.ctrl"); // 게시물 컨트롤러 추가
const isAuthenticated = require("../middlewares/auth"); // 로그인 여부 미들웨어 함수
const { validatePost } = require("../middlewares/validatePost");

// router.get("/api/posts", isAuthenticated, ctrl.post);
router.post("/api/login", userCtrl.login);
router.post("/api/register", userCtrl.register);
router.post("/api/logout", userCtrl.logout);

router.post('/api/posts', isAuthenticated, validatePost("create"), postCtrl.createPost); // 게시물 생성
router.get("/api/posts", postCtrl.getAllPosts); // 게시물 조회
router.patch("/api/posts/:id", isAuthenticated, validatePost("update"), postCtrl.updatePost); // 게시물 수정
router.delete("/api/posts/:id", isAuthenticated, postCtrl.deletePost); // 게시물 삭제

module.exports = router;