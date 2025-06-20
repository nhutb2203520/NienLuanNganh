const express = require('express')
const router = express.Router()
const nxbController = require('../controllers/nhaxuatban.controller')

router.post('/', nxbController.addPublisher)
       .get('/', nxbController.getAllPublisher) 
       .get('/:MaNXB',nxbController.getOnePublisher)
       .patch('/:MaNXB', nxbController.update)
       .delete('/:MaNXB', nxbController.delete)
module.exports = router