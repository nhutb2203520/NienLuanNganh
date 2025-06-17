const express = require('express')
const router = express.Router()
const viTriController = require('../controllers/vitri.controller')

router.post('/',viTriController.addPosition)

module.exports = router