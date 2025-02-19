const express = require('express');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { Post } = require('../models/Post');
const router = express.Router();

// AWs S3 설정
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

// base64 이미지를 S3에 업로드하는 함수
const uploadBase64ImageToS3 = async (base64Data, mimeType) => {
    const buffer = Buffer.from(base64Data, 'base64');

    const extension = mimeType.split('/')[1]; // image.jpeg = > jpeg
    const fileName = `posts/${uuidv4()}.${extension}`; // 고유한 파일 이름 + 확장자

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName, // 고유한 파일 이름을 생성
        Body: buffer,
        ContentType: mimeType, // 이미지 타입 지정 (확장자에 맞게 설정) 
        ACL: 'public-read' // 공개 읽기 권한 설정
    };
    
    try {
        const uploadResult = await s3.upload(params).promise();
        return uploadResult.Location;
    } catch (error) {
        throw new Error('이미지 업로드 실패');
    }
};

router.post('/posts', async (req, res) => {
    const { content, post_img, mimeType } = req.body;

    if (!post_img) {
        return res.status(400).json({ error: "게시물 내용은 필수입니다."})
    }
    
    try {
        //base64로 받은 이미지 S3에 업로드
        const imageUrl = await uploadBase64ImageToS3(post_img, mimeType);

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
