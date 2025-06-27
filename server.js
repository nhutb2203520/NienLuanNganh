const express = require('express')
const cors = require('cors')
const connectDB = require('./src/config/mongoose')
const routes = require('./src/routes/')
const path = require('path')
const ApiError = require('./src/ApiError')
require('dotenv').config()
const app = express()
connectDB(process.env.MONGODB_URI)
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(cors())

app.get('/', (req, res) => {
    res.json({
        message: 'Chào mừng đến với trang quản lý mượn trả sách.'
    })
})
app.use('/', routes)
app.use((req, res, next) => {
    next(new ApiError(404, 'Resource not Found'))
})

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error'
    });
});
app.listen(process.env.PORT, () => {
    console.log(`Server chạy ở cổng: ${process.env.PORT}`)
})