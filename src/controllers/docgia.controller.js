const ApiError = require('../ApiError')
const DocGiaService = require('../services/docgia.service')
const jwt = require('jsonwebtoken')
require('dotenv').config()
function verifyToken(req, res){
    const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')[1]
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET || 'NienLuanNganh', (error, reader) => {
            if(error){
                reject('Không có quyền')
            }else{
                resolve(reader)
            }
        })
    })
}

module.exports.register = async (req, res, next) => {
    try{
        const data = req.body
        const docGiaService = new DocGiaService()
        const result = await docGiaService.register(data)
        return res.status(201).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi người dùng đăng ký tài khoản.'))
    }
}
module.exports.login = async (req, res, next) => {
    try {
        const data = req.body;
        const docGiaService = new DocGiaService();
        const result = await docGiaService.login(data);
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return next(new ApiError(500, 'Lỗi khi người dùng đăng nhập.'));
    }
}
module.exports.updateAccount = async (req, res, next) => {
    try{
        await verifyToken(req, res)
        const id = req.params.id
        const data = req.body
        const docGiaService = new DocGiaService()
        const result = await docGiaService.updateAccount(id, data)
        return res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi cập nhật tài khoản người dùng.'))
    }
}
module.exports.deleteMyAccount = async (req, res, next) => {
    try{
        const reader = await verifyToken(req, res)
        const docGiaService = new DocGiaService()
        const result = await docGiaService.deleteAccount(reader._id)
        return res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi xóa tài khoản từ người dùng.'))
    }
}
module.exports.changePassword = async (req, res, next) => {
    try{
        const reader = await verifyToken(req, res)
        const {currentPassword, newPassword} = req.body
        const docGiaService = new DocGiaService()
        const result = await docGiaService.changePassword(reader._id, currentPassword, newPassword)
        return res.status(200).json(result)
    }catch(err) {
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi đổi mật khẩu.'))
    }
}