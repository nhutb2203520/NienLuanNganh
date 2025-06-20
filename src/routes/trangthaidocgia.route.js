const express = require('express')
const router = express.Router()
const trangThaiDocGiaController = require('../controllers/trangthaidocgia.controller')

router.post('/', trangThaiDocGiaController.add)


module.exports = router