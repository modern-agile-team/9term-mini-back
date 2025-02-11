"use strict";

const User = require("../models/User");

const process = {
  login: async (req, res, next) => {
    const user = new User(req.body);
    const response = await user.login();
    // 반환된 email 값으로 userName을 보냄.
    const idx = response.email.indexOf("@");
    const userName = response.email.substr(0, idx);

    if (response.success) {
      req.session.user = {
        email: response.email,
        pwd: response.pwd,
        userName: userName,
      };
      return res.json({ success: true, user: req.session.user });

      next();
    } else {
      return res
        .status(401)
        .json({ success: false, msg: "인증되지 않습니다." });
    }
  },
};

module.exports = process;
