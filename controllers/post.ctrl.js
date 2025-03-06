"use strict";

const sendResponse = require("../utils/responseHelper");
const { uploadBase64ImageToS3 } = require("../s3/s3Uploader");
const Post = require("../models/Post");

// 게시물 생성
const createPost = async (req, res) => {
  try {
    const { content, postImg } = req.body;
    const userId = req.session.user.id;

    // postImg 없으면 오류
    if (!postImg) {
      return sendResponse(res, 400, false, "게시물 이미지는 필수입니다.");
    }

    // S3에 이미지 업로드
    const imageUrl = await uploadBase64ImageToS3(postImg);

    const post = new Post({ content, postImg: imageUrl }, userId);
    const postId = await post.createPost();
    return sendResponse(res, 201, true, "게시물이 성공적으로 생성되었습니다.", { postId });
  } catch (err) {
    console.error("Create post error:", err);
    return sendResponse(res, 500, false, "게시물 생성 중 문제가 발생했습니다.");
  }
};

// 모든 게시물 조회
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.getAllPosts();
    return sendResponse(res, 200, true, "게시물 조회 성공", posts);
  } catch (err) {
    console.error("Get all posts error:", err);
    return sendResponse(res, 500, false, "게시물 조회 중 문제가 발생했습니다.");
  }
};

// 게시물 수정
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, postImg } = req.body;
    const userId = req.session.user.id;

    if (!id) return sendResponse(res, 400, false, "post_id는 필수입니다.");

    // 새 이미지가 제공되면 S3에 업로드하여 교체, 없으면 기존 이미지 유지
    const imageUrl = postImg ? await uploadBase64ImageToS3(postImg) : undefined;

    const post = new Post({ content, postImg: imageUrl }, userId);

    const result = await post.updatePost(id);

    if (result) {
      return sendResponse(res, 200, true, "게시물이 수정되었습니다.");
    }
    return sendResponse(res, 403, false, "수정 권한이 없거나 게시물이 존재하지 않습니다.");
  } catch (err) {
    console.error("Update post error:", err);
    return sendResponse(res, 500, false, "게시물 수정 중 문제가 발생했습니다.");
  }
};

// 게시물 삭제
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.user.id;

    if (!id) return sendResponse(res, 400, false, "post_id는 필수입니다.");

    const result = await Post.deletePost(id, userId);

    if (result) {
      return sendResponse(res, 200, true, "게시물이 삭제되었습니다.");
    }
    return sendResponse(res, 403, false, "삭제 권한이 없거나 게시물이 존재하지 않습니다.");
  } catch (err) {
    console.error("Delete post error:", err);
    return sendResponse(res, 500, false, "게시물 삭제 중 문제가 발생했습니다.");
  }
};

module.exports = { createPost, getAllPosts, updatePost, deletePost };
