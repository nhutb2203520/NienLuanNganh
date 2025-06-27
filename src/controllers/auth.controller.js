const AuthService = require("../services/auth.service");
const ApiError = require('../ApiError')

module.exports.forgotPassword = async (req, res) => {
  try {
    const { identifier } = req.body;
    const result = await AuthService.requestResetPassword(identifier);
    return res.json(result);
  } catch (err) {
    console.log(err)
    return next(new ApiError(500, 'Lỗi khi người dùng quên mật khẩu.'))
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { Password } = req.body;
    const result = await AuthService.resetPassword(token, Password);
    return res.json(result);
  } catch (err) {
    console.log(err)
    return next(new ApiError(500, 'Lỗi khi người dùng nhập lại mật khẩu mới.'))
  }
};
