const ApiError = require('../ApiError')
const PublisherService = require('../services/nhaxuatban.service')
const jwt = require('jsonwebtoken')
require('dotenv').config()


function verifyToken (req, res) {
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
module.exports.getAllPublisher = async (req, res, next) =>{
    try{
        await verifyToken(req, res)
        const publisherService = new PublisherService()
        const result = await publisherService.getAllPublisher()
        res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi lấy danh sách nhà xuất bản.'))
    }
}
module.exports.getOnePublisher = async (req, res, next) => {
    try{
        await verifyToken(req, res)
        const MaNXB = req.params?.MaNXB
        const publisherService = new PublisherService()
        const result = await publisherService.getOnePublisher(MaNXB)
        res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi lấy một nhà xuất bản.'))
    }
}
module.exports.addPublisher = async (req, res, next) => {
    try{
        await verifyToken(req, res)
        const data = req.body
        const publisherService = new PublisherService()
        const result = await publisherService.addPublisher(data)
        return res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi thêm nhà xuất bản.'))
    }
}
module.exports.update = async (req, res, next) =>{
    try{
        await verifyToken(req, res)
        const MaNXB = req.params?.MaNXB
        const data = req.body
        const publisherService = new PublisherService()
        const result = await publisherService.update(MaNXB, data)
        res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi cập nhật nhà xuất bản.'))
    }
}
module.exports.delete = async (req, res, next) => {
    try{
        await verifyToken(req, res)
        const MaNXB = req.params?.MaNXB
        const publisherService = new PublisherService()
        const result = await publisherService.delete(MaNXB)
        res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi xóa nhà xuất bản.'))
    }
}