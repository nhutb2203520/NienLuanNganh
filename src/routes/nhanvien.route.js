const express = require('express')
const router = express.Router()
const nhanVienController = require('../controllers/nhanvien.controller')

router.post('/register', nhanVienController.StaffRegister)

module.exports = router