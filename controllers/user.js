"use strict";

const User = require("../models/user");
const UserStorage = require("../storages/userStorage");

// 공통 응답 헬퍼 함수
const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = { success, message };
  if (data) response.data = data;
  return res.status(statusCode).json(response);
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return sendResponse(res, 500, false, "로그아웃 실패");
    }
    res.clearCookie("connect.sid");
    return sendResponse(res, 200, true, "로그아웃 성공");
  });
};

const login = async (req, res) => {
  console.log("DB_HOST:", process.env.DB_HOST);
  console.log("DB_USER:", process.env.DB_USER);
  console.log("DB_PW:", process.env.DB_PW ? "******" : "NOT SET");
  console.log("DB_DATABASE:", process.env.DB_DATBASE);
  try {
    const { email, pwd } = req.body;

    // 입력값 검증
    if (!email || !pwd) {
      return sendResponse(res, 400, false, "이메일과 비밀번호는 필수입니다.");
    }

    const user = new User(req.body);
    const response = await user.login();

    if (!response.success) {
      return sendResponse(res, 401, false, response.message || "로그인 실패");
    }

    // 이메일에서 사용자 이름 생성
    const userName = response.email.split("@")[0];

    // 세션에 사용자 정보 저장 (비밀번호 제외)
    req.session.user = {
      email: response.email,
      userName,
    };
    console.log(req.session);

    return sendResponse(res, 200, true, "로그인 성공", {
      user: req.session.user,
    });
  } catch (err) {
    console.error("Login error:", err);
    return sendResponse(res, 500, false, "서버 오류가 발생했습니다.");
  }
};

const register = async (req, res) => {
  try {
    const { email, pwd } = req.body;
    // 입력값 검증
    if (!email || !pwd) {
      return sendResponse(res, 400, false, "이메일과 비밀번호는 필수입니다.");
    }

    // 이메일 중복 체크

    const existingUser = await UserStorage.getUserByEmail(email);
    if (existingUser) {
      return sendResponse(res, 409, false, "이미 존재하는 이메일입니다.");
    }

    const user = new User(req.body);
    const response = await user.register();

    if (response.success) {
      return sendResponse(res, 201, true, "회원가입 성공", {
        user: response.user,
      });
    } else {
      return sendResponse(res, 400, false, response.message || "회원가입 실패");
    }
  } catch (err) {
    console.error("Register error:", err);
    return sendResponse(res, 500, false, "서버 오류가 발생했습니다.");
  }
};

module.exports = { logout, login, register };
