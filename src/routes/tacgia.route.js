const express = require('express')
const router = express.Router()
const tacGiaController = require('../controllers/tacgia.controller')

router.get('/', tacGiaController.getAll)
    .get('/:id', tacGiaController.getOne)
    .post('/', tacGiaController.add)
    .patch('/:id', tacGiaController.update)
    .delete('/:id', tacGiaController.delete)
module.exports = router