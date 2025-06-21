const ApiError  = require('../ApiError')
const TrangThaiService = require('../services/trangthaimuon.service')
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
//[GET] /states-book
module.exports.getAll = async (req, res, next) => {
    try{
        await verifyToken(req, res)
        const trangThaiService = new TrangThaiService()
        const result = await trangThaiService.getAll()
        res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi lấy danh sách trạng thái.'))
    }
}
//[POST] /states-book
module.exports.addTrangThai = async (req, res, next) => {
    try{
        await verifyToken(req, res)
        const data = req.body
        const trangThaiService = new TrangThaiService()
        const result = await trangThaiService.addTrangThai(data)
        return res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi thêm trạng thái.'))
    }
}
//[GET] /states-book/:MaTrangThai
module.exports.getOne = async (req, res, next) => {
    try{
        await verifyToken(req, res)
        const MaTrangThai = req.params?.MaTrangThai
        const trangThaiService = new TrangThaiService()
        const result = await trangThaiService.getOne(MaTrangThai)
        res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi lấy thông tin chi tiết một trạng thái sách.'))
    }
}
//[DELETE] /states-book/:MaTrangThai
module.exports.delete = async (req, res, next) => {
    try{
        await verifyToken(req, res)
        const MaTrangThai = req.params?.MaTrangThai
        const trangThaiService = new TrangThaiService()
        const result = await trangThaiService.delete(MaTrangThai)
        res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi xoá trạng thái sách.'))
    }
}