const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "9term_mini",
});

db.connect();

module.exports = db;
