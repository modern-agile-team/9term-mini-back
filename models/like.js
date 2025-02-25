const LikeStorage = require("../storages/likeStorage");

class Like {
    constructor(post_id, user_id) {
        this.post_id = post_id;
        this.user_id = user_id;
    }

    async toggleLike() {
        try {
            const isLiked = await LikeStorage.checkLike(this.post_id, this.user_id);

            if (isLiked) {
                await LikeStorage.removeLike(this.post_id, this.user_id);
                return { liked: false, message: "좋아요 취소됨" };
            } else {
                await LikeStorage.addLike(this.post_id, this.user_id);
                return { liked: true, message: "좋아요 추가됨" };
            }
        } catch (err) {
            throw new Error("좋아요 토글 중 오류 발생");
        }
    }

    async getLikeCount() {
        try {
            return await LikeStorage.getLikeCount(this.post_id);
        } catch (err) {
            throw new Error("좋아요 개수 조회 중 오류 발생");
        }
    }
}

module.exports = Like;