const express = require('express')
const router = express.Router()
const loaiSachController = require('../controllers/loaisach.controller')

router.post('/', loaiSachController.addLoaiSach)
    .get('/', loaiSachController.getAll)
    .get('/:MaLoai', loaiSachController.getOne)
    .patch('/:MaLoai', loaiSachController.update)
    .delete('/:MaLoai', loaiSachController.delete)

module.exports = router