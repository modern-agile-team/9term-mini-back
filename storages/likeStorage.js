const db = require("../config/db");

class LikeStorage {
    static async addLike(post_id, user_id) {
        const query = `
        INSERT INTO post_likes (post_id, user_id)
        VALUES (?, ?)
        `;
        try {
            const [result] = await db.execute(query, [post_id, user_id]);
            return result.affectedRows > 0;
        } catch (err) {
            throw new Error("좋아요 추가 중 오류 발생");
        }
    }

    static async removeLike(post_id, user_id) {
        const query = `
        DELETE FROM post_likes
        WHERE post_id = ? AND user_id = ?
        `;
        try {
            const [result] = await db.execute(query, [post_id, user_id]);
            return result.affectedRows > 0;
        } catch (err) {
            throw new Error("좋아요 삭제 중 오류 발생");
        }
    }

    // 유저 좋아요 여부 확인
    static async checkLike(post_id, user_id) {
        const query = `
        SELECT COUNT(*) AS count FROM post_likes
        WHERE post_id = ? AND user_id = ?
        `;
        try {
            const [rows] = await db.execute(query, [post_id, user_id]);
            return rows[0].count > 0;
        } catch (err) {
            throw new Error("좋아요 확인 중 오류 발생");
        }
    }

    // 게시물 총 좋아요 개수 반환
    static async getLikeCount(post_id) {
        const query = `
        SELECT COUNT(*) AS count FROM post_likes
        WHERE post_id = ?
        `;
        try {
            const [rows] = await db.execute(query, [post_id]);
            return rows[0].count;
        } catch (err) {
            throw new Error("좋아요 개수 조회 중 오류 발생");
        }
    }
}

module.exports = LikeStorage;


