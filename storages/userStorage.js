"use strict";

const db = require("../config/db");

class UserStorage {
  // 이메일로 사용자 정보 조회
  static async getUserByEmail(email) {
    try {
      const query = "SELECT * FROM users WHERE email2 = ?";
      const [results] = await db.query(query, [email]);
      console.log(results);
      return results[0] || null; // 첫 번째 결과 반환 (없으면 null)
    } catch (err) {
      console.error("Database query error:", err);
      throw new Error("데이터베이스 조회 중 오류가 발생했습니다.");
    }
  }

  // 사용자 생성
  static async createUser(email, pwd, profile_image) {
    try {
      const query =
        "INSERT INTO users (email, pwd, profile_image) VALUES (?, ?, ?)";
      const [results] = await db.query(query, [email, pwd, profile_image]); // Promise 기반 쿼리 실행
      return { success: true };
    } catch (err) {
      console.error("Database insert error:", err);
      throw new Error("사용자 생성 중 오류가 발생했습니다.");
    }
  }
}

module.exports = UserStorage;
