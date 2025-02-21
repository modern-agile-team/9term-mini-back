"use strict";

const Post = require("../models/Post");

// 공통 응답 헬퍼 함수
const sendResponse = (res, statusCode, success, message, data = null) => {
    const response = { success, message };
    if (data) response.data = data;
    return res.status(statusCode).json(response);
};

// 게시물 생성
const createPost = async (req, res) => {
    try {
        const { content, post_img } = req.body;
        const { user_id } = req; 

        const post = new Post({ content, post_img }, user_id);

        const postId = await post.createPost(); // createPost 호출 (Poststorage와 연결)
        
        return sendResponse(res, 201, true, "게시물 생성 성공", { post_id: postId });
    } catch (err) {
        console.error("Create post error:", err);
        return sendResponse(res, 500, false, "서버 오류가 발생했습니다.");
    }
};
       
// 모든 게시물 조회
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.getAllPosts();
        return sendResponse(res, 200, true, "게시물 조회 성공", posts);
    } catch (err) {
        console.error("Get all posts error:", err);
        return sendResponse(res, 500, false, "게시물 조회 중 오류가 발생했습니다.");
    }
};

// 게시물 수정
const updatePost = async (req, res) => {
    try {
        const { id } = req.params; 
        const { content, post_img } = req.body;
        const { user_id } = req;

        if (!id) {
            return sendResponse(res, 400, false, "post_id는 필수입니다.");
        }

        const post = new Post({ content, post_img }, user_id);
        const result = await post.updatePost(id); // 저장
        
        if (result) {
            return sendResponse(res, 200, true, "게시물 수정 성공");
        } else {
            return sendResponse(res, 400, false, "게시물 수정 실패");
        }
    } catch (err) {
        console.error("Update post error:", err);
        return sendResponse(res, 500, false, "게시물 수정 중 오류가 발생했습니다.");
    }
};

// 게시물 삭제
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return sendResponse(res, 400, false, "post_id는 필수입니다.");
        }

        const post = new Post({}, null);
        const result = await post.deletePost(id);

        if (result) {
            return sendResponse(res, 200, true, "게시물 삭제 성공");
        } else {
            return sendResponse(res, 400, false, "게시물 삭제 실패");
        }
    } catch (err) {
        console.error("Delete post error:", err);
        return sendResponse(res, 500, false, "게시물 삭제 중 오류가 발생했습니다.");
    }
};

module.exports = { createPost, getAllPosts, updatePost, deletePost };