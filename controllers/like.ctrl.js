const Like = require('../models/like');

// 공통 응답 헬퍼 함수
const sendResponse = (res, statusCode, success, message, data = null) => {
    const response = { success, message };
    if (data) response.data = data;
    return res.status(statusCode).json(response);
};

const toggleLike = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.session.user.id;

        if (!userId) {
            return sendResponse(res, 401, false, "로그인이 필요합니다.");
        }

        const like = new Like(id, userId);
        const result = await like.toggleLike();

        return sendResponse(res, 200, true, result.message, { liked: result.liked });
    }  catch (err) {
        console.error(err);
        return sendResponse(res, 500, false, "좋아요 토글 중 오류 발생");
    }
};

const getLikeCount = async (req, res) => {
    try {
        const { id } = req.params;
        const likeCount = await Like.getLikeCount(id);

        return sendResponse(res, 200, true, "좋아요 개수 조회 성공", { likeCount });
    } catch (err) {
        console.error(err);
        return sendResponse(res, 500, false, "좋아요 개수 조회 중 오류 발생");
    }
};

module.exports = { 
    toggleLike,
    getLikeCount,
 };