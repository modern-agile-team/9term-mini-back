"use strict";

const userStorage = require("../storages/userStorage");

module.exports = async function isAuthenticated(req, res, next) {
  try {
    console.log(req.sessionID);
    if (req.session && req.session.user) {
      // 세션 ID를 사용하여 DB에서 세션 정보 조회
      const isSessionValid = await userStorage.getSessionInfo(req.sessionID);

      if (isSessionValid) {
        // 세션이 유효하면 인증된 것으로 간주
        next();
      } else {
        // 세션 정보가 없으면 인증되지 않은 것으로 간주
        res.status(401).json({ message: "로그인이 필요합니다." });
      }
    } else {
      // 세션이 없거나 사용자 정보가 없으면 인증되지 않은 것으로 간주
      res.status(401).json({ message: "로그인이 필요합니다." });
    }
  } catch (error) {
    console.error("인증 중 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
};
