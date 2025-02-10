"use strict";

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "로그아웃 실패" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "로그아웃 성공" });
  });
};

module.exports = { logout };
