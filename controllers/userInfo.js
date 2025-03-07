"use strict";

const UserInfo = require("../models/userInfo");
const { uploadBase64ImageToS3 } = require("../s3/s3Uploader");

const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = { success, message };
  if (data) response.data = data;
  return res.status(statusCode).json(response);
};

const userInfo = async (req, res) => {
  try {
    const userEmail = req.session.user.email;
    const user = new UserInfo({ userEmail }); // 객체로 전달
    const userData = await user.getUserInfo();

    return sendResponse(res, 200, true, "사용자 정보 조회 성공", userData);
  } catch (error) {
    console.error("사용자 정보 조회 중 오류:", error);
    return sendResponse(res, 500, false, "서버 오류가 발생했습니다.");
  }
};

const updateProfile = async (req, res) => {
  try {
    const userEmail = req.session.user.email;
    const { profileImg } = req.body;

    if (!userEmail || !profileImg) {
      return sendResponse(
        res,
        400,
        false,
        "이메일 또는 프로필 이미지 정보가 누락되었습니다."
      );
    }

    const newImageUrl = await uploadBase64ImageToS3(profileImg, "profileImg");

    const user = new UserInfo({ newImageUrl, userEmail });
    const result = await user.updateUserInfo();

    if (result.success) {
      return sendResponse(res, 200, true, result.message, result.updatedInfo);
    } else {
      return sendResponse(res, 400, false, result.message);
    }
  } catch (error) {
    console.error("프로필 업데이트 중 오류:", error);
    return sendResponse(res, 500, false, "서버 오류가 발생했습니다.");
  }
};

const deleteProfile = async (req, res) => {
  try {
    const userEmail = req.session.user.email;
    const user = new UserInfo({ userEmail }); // 객체로 전달
    const result = await user.deleteProfileImg();

    if (result) {
      return sendResponse(res, 200, true, "프로필 이미지 삭제 성공", {
        userEmail,
      });
    } else {
      return sendResponse(
        res,
        404,
        false,
        "프로필 이미지를 찾을 수 없거나 이미 삭제되었습니다."
      );
    }
  } catch (error) {
    console.error("프로필 이미지 삭제 중 오류:", error);
    return sendResponse(res, 500, false, "서버 오류가 발생했습니다.");
  }
};

module.exports = { userInfo, updateProfile, deleteProfile };
