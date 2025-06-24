const express = require('express')
const router = express.Router()
const muonSachController = require('../controllers/muonsach.controller')
const { verifyTokenUser, verifyTokenStaff} = require('../middlewares/verifyToken')

router.post('/:MaSach', verifyTokenUser, muonSachController.add)
    .get('/', verifyTokenUser, muonSachController.getAllForUser)
    .get('/admin', verifyTokenStaff, muonSachController.getAllForAdmin)
    .patch('/:MaMuon', verifyTokenStaff, muonSachController.updateTrangThai)
    .get('/borrows-deadline', verifyTokenStaff, muonSachController.getBorrowsDeadline)
module.exports = router