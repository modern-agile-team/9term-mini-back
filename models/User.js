"use strict";

const userStorage = require("./userStorage");

class User {
  constructor(body) {
    this.body = body;
  }

  async login() {
    const { user } = this.body;
    try {
      const { email, pwd } = await userStorage.getUserInfo(user.email);
      if (email) {
        if (email === user.email && pwd === user.pwd) {
          //조건이 참일 경우 true, email과 pwd값을 반환함.
          return { success: true, email: email, pwd: pwd };
        } else {
          return { success: false, msg: "비밀번호를 다시 입력해주세요." };
        }
      } else {
        return { success: false, msg: "존재하지 않는 이메일입니다." };
      }
    } catch (err) {
      return { success: false, err };
    }
  }
}

module.exports = User;
