const express = require('express')
const router = express.Router()
const sachController = require('../controllers/sach.controller')

router.post('/', sachController.addBook)
module.exports = router