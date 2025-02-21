const express = require('express');
const { Post } = require('../models/Post');
const router = express.Router();

router.post('/posts', async (req, res) => {
    const { content, post_img } = req.body;

    if (!post_img) {
        return res.status(400).json({ error: "게시물 내용은 필수입니다."})
    }
    
    try {
        //base64로 받은 이미지 S3에 업로드
        const imageUrl = await uploadBase64ImageToS3(post_img);

        // RDS에 게시물 데이터 저장
        const post = new Post({
            content,
            post_img: imageUrl // S3 URL 저장
        });

        // DB에 게시물 생성
        await post.save();

        return res.status(201).json({
            success: true,
            message: '게시물 업로드 성공',
            data: post
        });
    } catch (error) {
        console.error('게시물 업로드 실패:', error);
        return res.status(500).json({ error: '이미지 업로드 실패', details: error.message });
    }
});
