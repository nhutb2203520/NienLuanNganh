const express = require('express')
const router = express.Router()

const nhaXuatBanRoute = require('./nhaxuatban.route')
const loaiSachRoute = require('./loaisach.route')

// Định tuyến tất cả ở đây
router.use('/publishers', nhaXuatBanRoute)
router.use('/category', loaiSachRoute)

module.exports = router
