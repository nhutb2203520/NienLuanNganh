const express = require('express')
const router = express.Router()
const nxbController = require('../controllers/nhaxuatban.controller')

router.post('/', nxbController.addPublisher)

module.exports = router