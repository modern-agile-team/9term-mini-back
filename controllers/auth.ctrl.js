const bcrypt = require("bcryptjs");
const UserModel = require("../models/User");

const signup = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "이메일과 비밀번호를 입력해 주세요." });
    }

    const username = email.split('@')[0];

    try {
        const user = await UserModel.findByEmail(email); 
        if (user) {
            return res.status(400).json({ message: "이미 가입된 이메일입니다." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // 사용자 생성
        const newUser = await UserModel.createUser(email, username, hashedPassword);

            return res.status(201).json({ message: "회원가입 성공!", user: username });
        } catch (err) {
            console.error("회원가입 오류:", err);
            return res.status(500).json({ message: "회원가입 중 오류 발생." });
        }
    };

module.exports = { signup };