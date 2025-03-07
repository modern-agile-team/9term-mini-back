const validatePost = (req, res, next) => {
        const { postImg } = req.body;

        // 이미지 인코딩 검증
        if (postImg && !String(postImg).startsWith('data:image/')) {
            return res.status(400).json({ error: "유효하지 않은 인코딩 이미지입니다." });
        }

        next();
};

module.exports = { validatePost };