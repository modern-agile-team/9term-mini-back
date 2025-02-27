"use strict";

module.exports = function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    // 세션이 존재하고 사용자 정보가 있으면 인증된 것으로 간주
    next();
  } else {
    // 인증되지 않은 경우
    res.status(401).json({ message: "인증이 필요합니다." });
  }
};
