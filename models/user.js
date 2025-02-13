"use strict";

const userStorage = require("../storages/userStorage");
const bcrypt = require("bcrypt");

class User {
  constructor(body) {
    this.body = body; // 요청 데이터를 저장
  }

  async login() {
    const { email, pwd } = this.body; // email과 pwd 추출
    try {
      const userData = await userStorage.getUserByEmail(email); // DB에서 사용자 정보 조회

      if (!userData) {
        return { success: false, msg: "존재하지 않는 이메일입니다." };
      }

      // 비밀번호 해싱 비교
      const isPasswordValid = await bcrypt.compare(pwd, userData.pwd);
      if (!isPasswordValid) {
        return { success: false, msg: "비밀번호를 다시 입력해주세요." };
      }

      return { success: true, email: userData.email }; // 로그인 성공
    } catch (err) {
      return { success: false, err }; // 에러 처리
    }
  }

  async register() {
    const { email, pwd, profile_image } = this.body;
    try {
      // 비밀번호 해싱
      const hashedPwd = await bcrypt.hash(pwd, 10); // saltRounds = 10

      // DB에 사용자 저장
      const response = await userStorage.createUser(
        email,
        hashedPwd,
        profile_image
      );

      if (response.success) {
        return { success: true, msg: "회원가입이 완료되었습니다." };
      } else {
        return { success: false, msg: "회원가입에 실패했습니다." };
      }
    } catch (err) {
      return { success: false, err }; // 에러 처리
    }
  }
}

module.exports = User;
