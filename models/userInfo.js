"use strict";

const userStorage = require("../storages/userStorage");

class UserInfo {
  constructor(body) {
    this.body = body; // 요청 데이터를 객체로 저장
  }

  async getUserInfo() {
    try {
      const { userEmail } = this.body;
      const userInfo = await userStorage.getUserInfo({ userEmail });
      console.log(userEmail);
      return userInfo;
    } catch (error) {
      console.error("사용자 정보 조회 중 오류:", error);
      throw error;
    }
  }

  async updateUserInfo() {
    try {
      const { newImageUrl, userEmail } = this.body;

      if (!newImageUrl || !userEmail) {
        throw new Error("프로필 이미지 또는 이메일 정보가 누락되었습니다.");
      }

      const response = await userStorage.updateProfileImg({
        email: userEmail,
        newImageURL: newImageUrl,
      });

      if (response.success) {
        return {
          success: true,
          message: response.message,
          updatedInfo: { userEmail, profileImg: newImageUrl },
        };
      } else {
        throw new Error("프로필 이미지 업데이트에 실패했습니다.");
      }
    } catch (error) {
      console.error("프로필 이미지 업데이트 중 오류:", error);
      return {
        success: false,
        message:
          error.message || "프로필 이미지 업데이트 중 오류가 발생했습니다.",
      };
    }
  }

  async deleteProfileImg() {
    try {
      const { userEmail } = this.body;
      const userInfo = await userStorage.deleteProfileImageByEmail({
        userEmail,
      });
      return userInfo;
    } catch (error) {
      console.error("프로필 이미지 삭제 중 오류:", error);
      throw error;
    }
  }
}

module.exports = UserInfo;
