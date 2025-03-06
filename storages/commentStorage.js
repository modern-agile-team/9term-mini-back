"use strict";

const db = require("../config/db");

class CommentStorage {
  static async create(postId, userId, comment) {
    try {
      const query =
        "INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)";

      const [result] = await db.execute(query, [postId, userId, comment]);

      return { success: true, data: { id: result.insertId } };
    } catch (error) {
      console.error("댓글 생성 중 오류:", error);
      throw error;
    }
  }

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
      console.error("댓글 조회 중 오류:", error);
      throw error;
    }
  }

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
      console.error("댓글 삭제 중 오류:", error);
      throw error;
    }
  }
}

module.exports = CommentStorage;
