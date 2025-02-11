const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "insta",
    password: "9mini",
    database: "mini_db"
});

db.connect();

module.exports = db;
