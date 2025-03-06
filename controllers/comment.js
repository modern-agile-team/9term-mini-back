"use strict";
// commentController.js
const Comment = require("../models/comment");

// 공통 응답 헬퍼 함수
const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = { success, message };
  if (data) response.data = data;
  return res.status(statusCode).json(response);
};

const createComment = async (req, res) => {
  const { postId } = req.params;
  const { comment } = req.body;

  try {
    if (!postId || !comment) {
      return sendResponse(
        res,
        400,
        false,
        "게시물 ID와 댓글 내용은 필수입니다."
      );
    }

    const userId = req.session.user.id;
    console.log(userId);

    const newComment = new Comment({ postId, userId, comment });
    const response = await newComment.create();

    if (response.success) {
      return sendResponse(
        res,
        201,
        true,
        "댓글이 성공적으로 생성되었습니다.",
        response.data
      );
    } else {
      return sendResponse(
        res,
        400,
        false,
        response.message || "댓글 생성 실패"
      );
    }
  } catch (error) {
    console.error("댓글 생성 중 오류:", error);
    return sendResponse(res, 500, false, "서버 오류가 발생했습니다.");
  }
};

const getComments = async (req, res) => {
  const { postId } = req.params;
  console.log(postId);

  try {
    if (!postId) {
      return sendResponse(res, 400, false, "게시물 ID가 필요합니다.");
    }

    const comments = await Comment.getByPostId(postId);

    if (comments.length === 0) {
      return sendResponse(res, 404, false, "댓글이 없습니다.");
    }

    return sendResponse(res, 200, true, "댓글 조회 성공", comments);
  } catch (error) {
    console.error("댓글 조회 중 오류:", error);
    return sendResponse(res, 500, false, "서버 오류가 발생했습니다.");
  }
};

const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    if (!commentId) {
      return sendResponse(res, 400, false, "댓글 ID가 필요합니다.");
    }

    // 삭제 권한 확인: 작성자만 삭제 가능
    const comment = await Comment.getById(commentId);
    if (!comment || comment.userId !== req.session.user.id) {
      return sendResponse(res, 403, false, "댓글 삭제 권한이 없습니다.");
    }

    const response = await Comment.delete(commentId);

    if (response.success) {
      return sendResponse(res, 200, true, "댓글이 성공적으로 삭제되었습니다.");
    } else {
      return sendResponse(
        res,
        404,
        false,
        response.message || "댓글 삭제 실패"
      );
    }
  } catch (error) {
    console.error("댓글 삭제 중 오류:", error);
    return sendResponse(res, 500, false, "서버 오류가 발생했습니다.");
  }
};

module.exports = { createComment, getComments, deleteComment };
