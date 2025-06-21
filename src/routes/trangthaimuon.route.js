const express = require('express')
const router = express.Router()
const trangThaiController = require('../controllers/trangthaimuon.controller')

router.post('/', trangThaiController.addTrangThai)
    .get('/', trangThaiController.getAll)
    .get('/:MaTrangThai', trangThaiController.getOne)
    .delete('/:MaTrangThai', trangThaiController.delete)


module.exports = router