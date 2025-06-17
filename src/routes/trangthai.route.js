const express = require('express')
const router = express.Router()
const trangThaiController = require('../controllers/trangthai.controller')

router.post('/', trangThaiController.addTrangThai)


module.exports = router