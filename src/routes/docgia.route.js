const express = require('express')
const router = express.Router()
const docGiaController = require('../controllers/docgia.controller')

router.post('/register', docGiaController.register)

module.exports = router