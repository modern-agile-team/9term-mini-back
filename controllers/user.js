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
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return sendResponse(res, 500, false, "로그아웃 실패");
      }
      res.clearCookie("connect.sid", { path: "/" });
      return sendResponse(res, 200, true, "로그아웃 성공");
    });
  } else {
    return sendResponse(res, 200, true, "이미 로그아웃 상태입니다.");
  }
};

const login = async (req, res) => {
  try {
    const { email, pwd } = req.body;

    if (!email || !pwd) {
      return sendResponse(res, 400, false, "이메일과 비밀번호는 필수입니다.");
    }

    const user = new User(req.body);
    const response = await user.login();

    if (!response.success) {
      return sendResponse(res, 401, false, response.msg || "로그인 실패");
    }

    console.log("Login response:", response); // 로그인 응답 데이터 확인

    req.session.user = {
      id: response.id,
      name: response.name,
      email: response.email,
    };

    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return sendResponse(
          res,
          500,
          false,
          "세션 저장 중 오류가 발생했습니다."
        );
      }

      return sendResponse(res, 200, true, "로그인 성공", {
        user: { email: response.email },
      });
    });
  } catch (err) {
    console.error("Login error:", err);
    return sendResponse(res, 500, false, "서버 오류가 발생했습니다.");
  }
};

const register = async (req, res) => {
  try {
    const { email, pwd } = req.body;
    if (!email || !pwd) {
      return sendResponse(res, 400, false, "이메일과 비밀번호는 필수입니다.");
    }

    const existingUser = await UserStorage.getUserByEmail(email);
    if (existingUser) {
      return sendResponse(res, 409, false, "이미 존재하는 이메일입니다.");
    }

    const user = new User(req.body);
    const response = await user.register();

    if (response.success) {
      return sendResponse(res, 201, true, "회원가입 성공");
    } else {
      return sendResponse(res, 400, false, response.message || "회원가입 실패");
    }
  } catch (err) {
    console.error("Register error:", err);
    return sendResponse(res, 500, false, "서버 오류가 발생했습니다.");
  }
};

module.exports = { logout, login, register };
