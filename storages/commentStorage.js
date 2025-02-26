"use strict";

const db = require("../config/db");

class CommentStorage {
  // 댓글 생성
  static async create(postId, userId, comment) {
    try {
      const query =
        "INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)";

      const [result] = await db.execute(query, [postId, userId, comment]);

      return { success: true, data: { id: result.insertId } };
    } catch (error) {
      console.error("Database insert error:", error);
      throw new Error("댓글 생성 중 데이터베이스 오류가 발생했습니다.");
    }
  }

  // 특정 게시물의 모든 댓글 조회
  static async findAllByPostId(postId) {
    try {
      const query =
        "SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC";

      const [rows] = await db.execute(query, [postId]);

      return rows.map((row) => ({
        id: row.id,
        postId: row.post_id,
        userId: row.user_id,
        comment: row.comment,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (error) {
      console.error("Database query error:", error);
      throw new Error("댓글 조회 중 데이터베이스 오류가 발생했습니다.");
    }
  }

  // 댓글 삭제
  static async delete(commentId) {
    try {
      const query = "DELETE FROM comments WHERE id = ?";

      const [result] = await db.execute(query, [commentId]);

      if (result.affectedRows > 0) {
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error("Database delete error:", error);
      throw new Error("댓글 삭제 중 데이터베이스 오류가 발생했습니다.");
    }
  }
}

module.exports = CommentStorage;
