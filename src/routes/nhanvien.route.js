const express = require('express')
const router = express.Router()
const nhanVienController = require('../controllers/nhanvien.controller')

router.post('/register', nhanVienController.StaffRegister)
    .post('/login', nhanVienController.login)
    .patch('/change-password', nhanVienController.changePassword)
    .patch('/me', nhanVienController.updateAccountStaff)
    //xóa tài khoản cá nhân
module.exports = router