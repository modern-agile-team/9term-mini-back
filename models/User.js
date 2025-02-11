const bcrypt = require('bcryptjs');
const db = require("../config/db");

class UserModel {
    static createUser (email, username, password, profile_image_url = 'default_url') {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) return reject(err);
                const query = `INSERT INTO users (id, email, password, profile_image_url) VALUES (?, ?, ?, ?)`;
                db.query(query, [username, email, hashedPassword, profile_image_url], (err, results) => {
                    if (err) return reject(err);
                    resolve(null, { id: results.insertId, email: email, username: username });
                });
            });
        });
    }   

    static findByEmail(email) {
        return new Promise((resolve, reject) => {
            const query = `SELECT id, email, profile_image_url FROM users WHERE email = ?`;
            db.query(query, [email], (err, results) => {
                if (err) return reject(err);
                resolve(results[0] || null);
            });
        });
    }
}

module.exports = UserModel;