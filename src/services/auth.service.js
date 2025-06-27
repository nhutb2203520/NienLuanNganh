const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const docGiaModel = require("../models/docgia.model");
const ResetToken = require("../models/resettoken.model");
const { sendMail } = require("../utils/mailer");

const CLIENT_URL = process.env.CLIENT_URL;

class AuthService {
  async requestResetPassword(identifier) {
    const user = await docGiaModel.findOne(
      { 
        $or:[{Email: identifier.trim().toLowerCase()}, {SoDienThoai: identifier.trim().toLowerCase()}]
      }
    );
    if (!user) {
        return {
            message: 'Không tìm thấy người dùng có tài khoản này.'
        }
    }
    //random token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 tiếng

    await ResetToken.create({
      DocGiaId: user._id,
      Token: token,
      expiresAt
    });

    const resetLink = `${CLIENT_URL}/reset-password/${token}`;
    const html = `
      <p>Bạn vừa yêu cầu khôi phục mật khẩu.</p>
      <p>Click vào đây để đặt lại mật khẩu: <a href="${resetLink}">${resetLink}</a></p>
      <p>Liên kết có hiệu lực trong 1 tiếng.</p>
    `
    await sendMail(user.Email, "Khôi phục mật khẩu", html );

    return { message: "Email khôi phục mật khẩu đã được gửi." };
  }

  async resetPassword(token, newPassword) {
    const resetToken = await ResetToken.findOne({
      Token: token,
      expiresAt: { $gt: new Date() }
    });

    if (!resetToken) throw new Error("Token không hợp lệ hoặc đã hết hạn.");

    const user = await docGiaModel.findById(resetToken.DocGiaId);
    if (!user) throw new Error("Không tìm thấy người dùng.");

    const salt = await bcrypt.genSalt(10);
    user.Password = await bcrypt.hash(newPassword, salt);
    await user.save();

    await ResetToken.deleteOne({ _id: resetToken._id });

    return { message: "Đặt lại mật khẩu thành công." };
  }
}

module.exports = new AuthService();
