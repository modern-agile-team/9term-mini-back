"use strict";

const db = require("../config/db");

class UserStorage {
  static async getUserByEmail({ email }) {
    try {
      const query = "SELECT * FROM users WHERE email = ?";
      const [results] = await db.query(query, [email]);
      return results[0] || null;
    } catch (err) {
      console.error("Database query error:", err);
      throw new Error("데이터베이스 조회 중 오류가 발생했습니다.");
    }
  }

  static async updateProfileImg({ email, newImageURL }) {
    try {
      const query = "UPDATE users SET profile_image = ? WHERE email = ?";
      const [result] = await db.query(query, [newImageURL, email]);

      if (result.affectedRows === 0) {
        throw new Error(
          "사용자를 찾을 수 없거나 이미지 업데이트에 실패했습니다."
        );
      }

      return {
        success: true,
        message: "프로필 이미지가 성공적으로 업데이트되었습니다.",
      };
    } catch (err) {
      console.error("Database update error:", err);
      throw new Error("프로필 이미지 업데이트 중 오류가 발생했습니다.");
    }
  }

  static async getUserInfo({ userEmail }) {
    try {
      const query = "SELECT * FROM users WHERE email = ?";
      const [results] = await db.query(query, [userEmail]);
      return results[0] || null;
    } catch (err) {
      console.error("Database query error:", err);
      throw new Error("데이터베이스 조회 중 오류가 발생했습니다.");
    }
  }

  static async createUser({ email, hashedPwd, profileImage }) {
    try {
      const query = `
        INSERT INTO users (email, pwd, profile_image, name) 
        VALUES (?, ?, ?, SUBSTRING_INDEX(?, '@', 1))
      `;
      const [results] = await db.query(query, [
        email,
        hashedPwd,
        profileImage,
        email,
      ]);
      return { success: true };
    } catch (err) {
      console.error("Database insert error:", err);
      throw new Error("사용자 생성 중 오류가 발생했습니다.");
    }
  }

  static async deleteProfileImageByEmail({ email }) {
    try {
      const query = "UPDATE users SET profile_image = NULL WHERE email = ?";
      const [result] = await db.query(query, [email]);

      return result.affectedRows > 0;
    } catch (err) {
      console.error("Database query error:", err);
      throw new Error("프로필 이미지 삭제 중 오류가 발생했습니다.");
    }
  }

  static async getSessionInfo(sessionId) {
    try {
      const query = "SELECT * FROM sessions WHERE session_id = ?";
      const [results] = await db.execute(query, [sessionId]);

      if (!results || results.length === 0) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("세션 정보 조회 중 오류:", error);
      throw error;
    }
  }
}

module.exports = UserStorage;
