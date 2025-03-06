const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const s3 = require("./s3Config");

// base64 이미지를 S3에 업로드하는 함수
const uploadBase64ImageToS3 = async (base64Image, folder = "posts") => {
  console.log(`${folder}에 base64 이미지 업로드 시작`);
  const buffer = Buffer.from(base64Image, "base64");
  const fileName = `${folder}/${
    new Date().toISOString().split("T")[0]
  }-${uuidv4()}.jpeg`;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: "image/jpeg",
  };

  try {
    console.log("S3 업로드 진행 중...");

    const command = new PutObjectCommand(params);
    const uploadResult = await s3.send(command);
    console.log("S3 업로드 완료:", uploadResult);

    const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
    return imageUrl;
  } catch (error) {
    console.log("S3 업로드 실패:", error);
    throw new Error(`이미지 업로드 실패 ${error.message}`);
  }
};

module.exports = { uploadBase64ImageToS3 };
