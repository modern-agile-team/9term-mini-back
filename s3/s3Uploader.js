const s3 = require('./s3Config');
const { v4: uuidv4 } = require('uuid');

// base64 이미지를 S3에 업로드하는 함수
const uploadBase64ImageToS3 = async (base64Image) => {
    const buffer = Buffer.from(base64Image, 'base64');
    const fileName = `posts/${uuidv4()}.jpeg`;

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName, // 고유한 파일 이름을 생성
        Body: buffer,
        ContentType: 'image/jpeg', 
        ACL: 'public-read' // 공개 읽기 권한 설정
    };
    
    try {
        const uploadResult = await s3.upload(params).promise();
        return uploadResult.Location; // s3 url 반환
    } catch (error) {
        throw new Error(`이미지 업로드 실패 ${error.message}`);
    }
};

module.exports = { uploadBase64ImageToS3 };