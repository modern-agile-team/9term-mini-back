"use strict";

const db = require("../databases/db");

class UserStorage {
  static getUserInfo(email) {
    return new Promise((resolve, reject) => {
      const query = "select * from User where email = ?";
      db.query(query, [email], (err, data) => {
        if (err) reject(err);
        resolve(data[0]);
      });
    });
  }
}

module.exports = UserStorage;
