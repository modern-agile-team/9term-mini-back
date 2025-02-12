"use strict";

const db = require("../config/db");

class UserStorage {
  // 이메일로 사용자 정보 조회
  static getUserByEmail(email) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM users WHERE email = ?";
      db.query(query, [email], (err, results) => {
        if (err) {
          console.error("Database query error:", err);
          return reject(new Error("데이터베이스 조회 중 오류가 발생했습니다."));
        }
        console.log(results);
        resolve(results[0] || null); // 첫 번째 결과 반환 (없으면 null)
      });
    });
  }

  // 사용자 생성
  static createUser(email, pwd, profile_image) {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO users (email, pwd, profile_image) VALUES (?, ?, ?)";
      db.query(query, [email, pwd, profile_image], (err, results) => {
        if (err) {
          console.error("Database insert error:", err);
          return reject(new Error("사용자 생성 중 오류가 발생했습니다."));
        }
        resolve({ success: true });
      });
    });
  }
}

module.exports = UserStorage;
