const express = require('express')
const router = express.Router()
const docGiaController = require('../controllers/docgia.controller')
const nhanVienController = require('../controllers/nhanvien.controller')

// doc gia
router.post('/register', docGiaController.register)
    .post('/login', docGiaController.login)
    .delete('/me', docGiaController.deleteMyAccount)
    .patch('/changePassword', docGiaController.changePassword)
    .patch('/:id', docGiaController.updateAccount)
    //nhan vien
    .get('/',nhanVienController.getAllReaders)
    .get('/:id',nhanVienController.getOneReader)
    .delete('/:id', nhanVienController.deleteOneReader)
module.exports = router