"use strict";

const { uploadBase64ImageToS3 } = require("../s3/s3Uploader");
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
        const { content, postImg } = req.body;
        const userId = req.session.user.id;    
    
        // postImg 없으면 오류
        if (!postImg) {
            return sendResponse(res, 400, false, "게시물 이미지는 필수입니다.");
        }
        
        // S3에 이미지 업로드
        const imageUrl = await uploadBase64ImageToS3(postImg);
              
        const post = new Post({ content, postImg: imageUrl }, userId);
        const postId = await post.createPost(); // createPost 호출 (Poststorage와 연결)
        return sendResponse(res, 201, true, "게시물 생성 성공", { postId });
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
        const { content, postImg } = req.body;
        const userId = req.session.user.id;

        if (!id) return sendResponse(res, 400, false, "post_id는 필수입니다.");

        const existingPost = await Post.getPost(id);

        const existingImg = existingPost.postImg;
    
        // 새로운 이미지 업로드
        let imageUrl = existingImg;
        if (postImg) {
            imageUrl = await uploadBase64ImageToS3(postImg);
        }

        const post = new Post({ content, postImg: imageUrl }, userId);

        const result = await post.updatePost(id);
        
        if (result) {
            return sendResponse(res, 200, true, "게시물 수정 성공");
        } else {
            return sendResponse(res, 403, false, "수정 권한이 없거나 게시물이 존재하지 않습니다.");
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
        const userId = req.session.user.id;

        if (!id) return sendResponse(res, 400, false, "post_id는 필수입니다.");
        
        const result = await Post.deletePost(id, userId);

        if (result) {
            return sendResponse(res, 200, true, "게시물 삭제 성공");
        } else {
            return sendResponse(res, 403, false, "삭제 권한이 없거나 게시물이 존재하지 않습니다.");
        }
    } catch (err) {
        console.error("Delete post error:", err);
        return sendResponse(res, 500, false, "게시물 삭제 중 오류가 발생했습니다.");
    }
};

module.exports = { createPost, getAllPosts, updatePost, deletePost };