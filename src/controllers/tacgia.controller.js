const ApiError = require('../ApiError')
const TacGiaService = require('../services/tacgia.service')
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

//[GET] /authors
module.exports.getAll = async (req, res, next) => {
    try{
        await verifyToken(req, res)
        const tacGiaService = new TacGiaService()
        const result = await tacGiaService.getAll()
        res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi lấy danh sách tác giả.'))
    }
}
//[GET] /authors/:id
module.exports.getOne = async (req, res, next) => {
    try{
        await verifyToken(req, res)
        const id = req.params?.id
        const tacGiaService = new TacGiaService()
        const result = await tacGiaService.getOne(id)
        res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi lấy thông tin tác giả.'))
    }
}
//[POST] /authors
module.exports.add = async (req, res, next) =>{
    try{
        await verifyToken(req, res)
        const data = req.body
        const tacGiaService = new TacGiaService()
        const result = await tacGiaService.add(data)
        res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi lấy danh sách tác giả.'))
    }
}
//[PATCH] /authors/:id
module.exports.update = async (req, res, next) => {
    try{
        await verifyToken(req, res)
        const id = req.params?.id
        const data = req.body
        const tacGiaService = new TacGiaService()
        const result = await tacGiaService.update(id, data)
        res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi cập nhật thông tin tác giả.'))
    }
}
//[DELETE] /authors/:id
module.exports.delete = async (req, res, next) =>{
    try{
        await verifyToken(req, res)
        const id = req.params?.id
        const tacGiaService = new TacGiaService()
        const result = await tacGiaService.delete(id)
        res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi xóa tác giả.'))
    }
}