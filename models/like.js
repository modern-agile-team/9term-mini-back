const LikeStorage = require("../storages/likeStorage");

class Like {
    constructor(id, userId) {
        this.postId = id;
        this.userId = userId;
    }

    async toggleLike() {
        try {
            const isLiked = await LikeStorage.checkLike(this.postId, this.userId);

            if (isLiked) {
                await LikeStorage.removeLike(this.postId, this.userId);
                return { liked: false, message: "좋아요 취소됨" };
            } else {
                await LikeStorage.addLike(this.postId, this.userId);
                return { liked: true, message: "좋아요 추가됨" };
            }
        } catch (err) {
            throw new Error("좋아요 토글 중 오류 발생");
        }
    }

    static async getLikeCount(postId) {
        try {
            return await LikeStorage.getLikeCount(postId);
        } catch (err) {
            throw new Error("좋아요 개수 조회 중 오류 발생");
        }
    }
}

module.exports = Like;