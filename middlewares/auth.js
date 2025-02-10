"use strict";

module.exports = function isAuthenticated(req, res, next) {
  // 로그인 여부 확인 미들웨어
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "인증 필요" });
  }
};
