const validatePost = (action) => {
    return (req, res, next) => {
        const { post_img } = req.body;

        // 이미지 URL 검증
        if (post_img && !String(post_img).startsWith('http')) {
            return res.status(400).json({ error: "유효하지 않은 이미지 URL입니다." });
        }

        next();
    };
};

module.exports = { validatePost };