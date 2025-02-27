"use strict";

const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const commentCtrl = require("../controllers/comment");
const postCtrl = require("../controllers/post.ctrl");
const likeCtrl = require("../controllers/like.ctrl");
const isAuthenticated = require("../middlewares/auth");
const { validatePost } = require("../middlewares/validatePost");

router.post("/api/login", userCtrl.login);
router.post("/api/register", userCtrl.register);
router.post("/api/logout", userCtrl.logout);

router.get("/api/users/me", userCtrl.userInfo);

router.post("/api/posts/:postId/comments", commentCtrl.createComment);
router.get("/api/posts/:postId/comments", commentCtrl.getComments);
router.delete("/api/posts/:postId/comments/:commentId", commentCtrl.deleteComment);

router.post("/api/posts", isAuthenticated, validatePost, postCtrl.createPost);
router.get("/api/posts", postCtrl.getAllPosts);
router.patch("/api/posts/:id", isAuthenticated, validatePost, postCtrl.updatePost);
router.delete("/api/posts/:id", isAuthenticated, postCtrl.deletePost);

router.post('/api/posts/:id/like', isAuthenticated, likeCtrl.toggleLike);
router.get('/api/posts/:id/like', likeCtrl.getLikeCount);

module.exports = router;
