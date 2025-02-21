const db = require('../config/db');

class PostStorage {
    // 게시물 생성
    static async createPost({ user_id, content, post_img }) {
        try {
            const query = `INSERT INTO posts (user_id, content, post_img, created_at) VALUES (?, ?, ?, NOW())`;
            const [result] = await db.execute(query, [user_id, content, post_img]);
            return result.insertId;
        } catch (err) {
            console.error("Database insert error:", err);
            throw new Error("게시물 생성 중 오류가 발생했습니다.");
        }
    }

    // 전체 게시물 조회 (유저 정보 포함)
    static async getAllPosts() {
        try {
            const query = `SELECT posts.id AS post_id,
            posts.content,
            posts.post_img, 
            posts.created_at, 
            users.name AS author
            FROM posts
            JOIN users ON posts.user_id = users.id
            ORDER BY posts.created_at DESC;`

            const [results] = await db.query(query);
            return results;
        } catch (err) {
            console.error("Database query error:", err);
            throw new Error("게시물 조회 중 오류가 발생했습니다.");
        }
    }

    // 게시물 수정
    static async updatePost (post_id, updates) {
        try { 
            const fields = [];
            const values = [];

            if (updates.content) {
                fields.push("content = ?");
                values.push(updates.content);
            }
            if (updates.post_img) {
                fields.push("post_img = ?");
                values.push(updates.post_img);
            }
            if (fields.length === 0) {
                return true; // 아무 변경이 없어도 성공
            }

            values.push(post_id);
            const query = `UPDATE posts SET ${fields.join(", ")} WHERE id = ?`;
            const [result] = await db.execute(query, values);

            return result.affectedRows > 0;
        } catch (err) {
            console.error("Database update error:", err);
            throw new Error("게시물 수정 중 오류가 발생했습니다.");
        }
    }

    // 게시물 삭제
    static async deletePost(post_id) {
        try {
            const query = `DELETE FROM posts WHERE id = ?`;
            const [result] = await db.execute(query, [post_id]);
            return result.affectedRows > 0; // 삭제된 게시물 확인
        } catch (err) {
            console.error("Database delete error:", err);
            throw new Error("게시물 삭제 중 오류가 발생했습니다.");
        }
    }
}


module.exports = PostStorage;