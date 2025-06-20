const express = require('express')
const router = express.Router()
const viTriController = require('../controllers/vitri.controller')

router.post('/',viTriController.addPosition)
    .get('/', viTriController.getAll)
    .get('/:MaViTri', viTriController.getOne)
    .patch('/:MaViTri', viTriController.update)
    .delete('/:MaViTri', viTriController.delete)
module.exports = router