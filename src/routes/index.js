const express = require('express')
const router = express.Router()

const nhaXuatBanRoute = require('./nhaxuatban.route')
const loaiSachRoute = require('./loaisach.route')
const viTriRoute = require('./vitri.route')
const trangThaiRoute = require('./trangthaisach.route')
const nhanVienRoute = require('./nhanvien.route')
const docGiaRoute = require('./docgia.route')
const sachRoute = require('./sach.route')
const muonSachRoute = require('./muonsach.route')
const trangThaiDocGiaRoute = require('./trangthaidocgia.route')

// Định tuyến tất cả ở đây
router.use('/publishers', nhaXuatBanRoute)
router.use('/categorys', loaiSachRoute)
router.use('/positions', viTriRoute)
router.use('/states', trangThaiRoute)
router.use('/staffs', nhanVienRoute)
router.use('/readers', docGiaRoute)
router.use('/books', sachRoute)
router.use('/borrows', muonSachRoute)
router.use('/readerStatus', trangThaiDocGiaRoute)

module.exports = router
