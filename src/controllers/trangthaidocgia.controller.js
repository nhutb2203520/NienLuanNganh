const ApiError = require('../ApiError')
const TrangThaiDocGiaService = require('../services/trangthaidocgia.service')
const jwt = require('jsonwebtoken')
require('dotenv').config()

function verifyToken(req, res){
    const authHeaders = req.headers['authorization']
    const token = authHeaders.split(' ')[1]
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
//[POST] /status-reader
module.exports.add = async (req, res, next) => {
    try{
        await verifyToken(req, res)
        const data = req.body
        const trangThaiDocGiaService = new TrangThaiDocGiaService()
        const result = await trangThaiDocGiaService.add(data)
        res.status(200).json(result)
    }catch(err) {
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi thêm trạng thái độc giả.'))
    }
}
//[GET] /status-reader
module.exports.getAll = async (req, res, next) => {
    try{
        await verifyToken(req, res)
        const trangThaiDocGiaService = new TrangThaiDocGiaService()
        const result = await trangThaiDocGiaService.getAll()
        res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi lấy danh sách trạng thái độc giả.'))
    }
}
//[GET] /status-reader/:id
module.exports.getOne = async (req, res, next) => {
    try{
        await verifyToken(req, res)
        const id = req.params?.id
        const trangThaiDocGiaService = new TrangThaiDocGiaService()
        const result = await trangThaiDocGiaService.getOne(id)
        res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi lấy thông tin chi tiết trạng thái độc giả.'))
    }
}
//[DELETE] /status-reader/:id
module.exports.delete = async (req, res, next) => {
    try{
        await verifyToken(req, res)
        const id = req.params?.id
        const trangThaiDocGiaService = new TrangThaiDocGiaService()
        const result = await trangThaiDocGiaService.delete(id)
        res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi xóa trạng thái độc giả.'))
    }
}