const ApiError = require('../ApiError')
const SachService = require('../services/sach.service')
const jwt = require('jsonwebtoken')
require('dotenv').config()

function verifyToken(req, res) {
    const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')[1]
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET || 'NienLuanNganh', (error, staff) => {
            if(error || !staff.ChucVu){
                reject('Không có quyền.')
            }else{
                resolve(staff)
            }
        })
    })
}
//[POST] /books
module.exports.addBook = async (req, res, next) => {
    try {
        await verifyToken(req, res)
        const sachService = new SachService();
        const book = await sachService.addBook(req.body);
        res.status(201).json(book);
    } catch (error) {
        console.log(error)
        next(new ApiError(500, "Lỗi khi thêm sách."));
    }
}
//[GET] /books
module.exports.getAll = async (req, res, next) => {
    try {
        const sachService = new SachService();
        const book = await sachService.getAll();
        res.status(201).json(book);
    } catch (error) {
        console.log(error)
        next(new ApiError(500, "Lỗi khi lấy danh sách sách."));
    }
}
//[GET] /books/:MaSach
module.exports.getOne = async (req, res, next) => {
    try {
        const MaSach = req.params?.MaSach
        const sachService = new SachService();
        const book = await sachService.getOne(MaSach);
        res.status(201).json(book);
    } catch (error) {
        console.log(error)
        next(new ApiError(500, "Lỗi khi lấy thông tin sách."));
    }
}