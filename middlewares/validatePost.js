const Post = require('../models/Post'); 

const validatePost = (action) => {
    return (req, res, next) => {
        const { content, post_img } = req.body;

        if (!req.session.user) {
            return res.status(401).json({ error: "로그인이 필요합니다." }); // 로그인 안된 상태라면 에러
        }
        
        const user_id = req.session.user.id; // 세션에서 user_id 가져오기
        req.body.user_id = user_id; // 요청 본문에 user_id 추가

        
        const post = new Post({ content, post_img }, user_id);

        try {
            post.validate(action === "update");
            next();
        } catch(error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

module.exports = {
    validatePost
};