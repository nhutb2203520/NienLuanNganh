const express = require('express')
const router = express.Router()
const docGiaController = require('../controllers/docgia.controller')
const nhanVienController = require('../controllers/nhanvien.controller')

// doc gia
router.post('/register', docGiaController.register)
    .post('/login', docGiaController.login)
    .delete('/me', docGiaController.deleteMyAccount)
    .patch('/change-password', docGiaController.changePassword)
    .patch('/me', docGiaController.updateAccount)
    //nhan vien
    .get('/',nhanVienController.getAllReaders)
    .get('/list-readers-active', nhanVienController.getAllReadersActive)
    .get('/list-readers-blocked', nhanVienController.getAllReadersBlocked)
    .get('/:id',nhanVienController.getOneReader)
    .patch('/update-status/:id', nhanVienController.updateStatusReader)
module.exports = router