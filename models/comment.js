"use strict";

const CommentStorage = require("../storages/commentStorage");
class Comment {
  constructor(data) {
    this.data = data; // 요청 데이터를 저장
  }

  async create() {
    const { postId, userId, comment } = this.data;

    try {
      const response = await CommentStorage.create(postId, userId, comment);

      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, message: "댓글 생성 실패" };
      }
    } catch (error) {
      console.error("댓글 생성 중 오류:", error);
      return { success: false, message: "댓글 생성 실패" };
    }
  }

  static async getByPostId(postId) {
    try {
      const comments = await CommentStorage.findAllByPostId(postId);
      return comments;
    } catch (error) {
      console.error("댓글 조회 중 오류:", error);
      throw new Error("댓글 조회 실패");
    }
  }

  static async delete(commentId) {
    try {
      const response = await CommentStorage.delete(commentId);

      if (response.success) {
        return { success: true };
      } else {
        return { success: false, message: "댓글 삭제 실패" };
      }
    } catch (error) {
      console.error("댓글 삭제 중 오류:", error);
      throw new Error("댓글 삭제 실패");
    }
  }
}

module.exports = Comment;
