const express = require('express')
const router = express.Router()

const nhaXuatBanRoute = require('./nhaxuatban.route')
const loaiSachRoute = require('./loaisach.route')
const viTriRoute = require('./vitri.route')
const trangThaiRoute = require('./trangthai.route')
const nhanVienRoute = require('./nhanvien.route')
const docGiaRoute = require('./docgia.route')
const sachRoute = require('./sach.route')
const muonSachRoute = require('./muonsach.route')

// Định tuyến tất cả ở đây
router.use('/publisher', nhaXuatBanRoute)
router.use('/category', loaiSachRoute)
router.use('/position', viTriRoute)
router.use('/state', trangThaiRoute)
router.use('/staff', nhanVienRoute)
router.use('/reader', docGiaRoute)
router.use('/book', sachRoute)
router.use('/borrow', muonSachRoute)

module.exports = router
