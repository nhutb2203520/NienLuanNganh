const ApiError = require('../ApiError')
const PositionService = require('../services/vitri.service')
const jwt = require('jsonwebtoken')
require('dotenv').config()

function verifyToken(req, res) {
    const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')[1]
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET || 'NienLuanNganh', (error, staff) => {
            if(error || !staff.ChucVu){
                reject('Không có quyền')
            }else{
                resolve(staff)
            }
        })
    })
}
//[POST] /positions/
module.exports.addPosition = async (req, res, next) => {
    try{
        await verifyToken(req, res)
        const data = req.body
        const positionService = new PositionService()
        const result = await positionService.addPosition(data)
        return res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi thêm vị trí sách.'))
    }
}
//[GET] /positions
module.exports.getAll = async (req, res, next) => {
    try{
        await verifyToken(req, res)
        const positionService = new PositionService()
        const result = await positionService.getAll()
        res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi lấy danh sách vị trí.'))
    }
}
//[GET] /positions/:MaViTri
module.exports.getOne = async (req, res, next) => {
    try{
        await verifyToken(req, res)
        const MaViTri = req.params?.MaViTri
        const positionService = new PositionService()
        const result = await positionService.getOne(MaViTri)
        res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi lấy thông tin một vị trí.'))
    }
}
//[PATCH] /positions/:MaViTri
module.exports.update = async (req, res, next) => {
    try{
        await verifyToken(req, res)
        const MaViTri = req.params?.MaViTri
        const data = req.body
        const positionService = new PositionService()
        const result = await positionService.update(MaViTri, data)
        res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi cập nhật vị trí sách.'))
    }
}
//[DELETE] /positions/:MaViTri
module.exports.delete = async (req, res, next) => {
    try{
        await verifyToken(req, res)
        const MaViTri = req.params?.MaViTri
        const positionService = new PositionService()
        const result = await positionService.delete(MaViTri)
        res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi xóa vị trí sách.'))
    }
}