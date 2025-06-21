const express = require('express')
const router = express.Router()
const trangThaiDocGiaController = require('../controllers/trangthaidocgia.controller')

router.post('/', trangThaiDocGiaController.add)
    .get('/', trangThaiDocGiaController.getAll)
    .get('/:id', trangThaiDocGiaController.getOne)
    .delete('/:id', trangThaiDocGiaController.delete)

module.exports = router