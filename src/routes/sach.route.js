const express = require('express')
const router = express.Router()
const sachController = require('../controllers/sach.controller')
const { verifyTokenStaff } = require('../middlewares/verifyToken')

router.post('/', verifyTokenStaff, sachController.addBook)
    .get('/', sachController.getAll)
    .get('/:MaSach', sachController.getOne)
module.exports = router