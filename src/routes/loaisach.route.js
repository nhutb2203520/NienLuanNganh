const express = require('express')
const router = express.Router()
const loaiSachController = require('../controllers/loaisach.controller')

router.post('/', loaiSachController.addLoaiSach)

module.exports = router