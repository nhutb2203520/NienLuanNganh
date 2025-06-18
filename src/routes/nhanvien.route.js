const express = require('express')
const router = express.Router()
const nhanVienController = require('../controllers/nhanvien.controller')

router.post('/register', nhanVienController.StaffRegister)
    .post('/login', nhanVienController.login)
    .patch('/changePassword', nhanVienController.changePassword)
    .patch('/:id', nhanVienController.updateAccountStaff)
    
module.exports = router