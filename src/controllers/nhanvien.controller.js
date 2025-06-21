const ApiError = require('../ApiError')
const NhanVienService = require('../services/nhanvien.service')
const jwt = require('jsonwebtoken')

function verifyToken(req, res) {
    const authHeader = req.headers['authorization'];
    ///
    const token = authHeader.split(' ')[1];
    ///
    return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET || 'NienLuanNganh', (error, staff) => {
                if(error || !staff.ChucVu){
                    return reject('Không có quyền')
                }else{
                    resolve(staff)
                }
            })
        })
}
//[POST] /staffs/register
module.exports.StaffRegister = async (req, res, next) => {
    try{
        const data = req.body
        const nhanVienService = new NhanVienService()
        const result = await nhanVienService.register(data)
        return res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi nhân viên đăng ký.'))
    }
}
//[POST] /staffs/login
module.exports.login = async (req, res, next) =>{
    try{
        const data = req.body
        const nhanVienService = new NhanVienService()
        const result = await nhanVienService.login(data)
        return res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi nhân viên đăng nhập.'))
    }
}
//[PATCH] /staffs/me
module.exports.updateAccountStaff = async (req, res, next) => {
    try{
        const staff = await verifyToken(req, res)
        const data = req.body
        const nhanVienService = new NhanVienService()
        const result = await nhanVienService.updateAccountStaff(staff._id, data)
        return res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi Khi cập nhật tài khoản nhân viên.'))
    }
}
//[GET] /readers
module.exports.getAllReaders = async (req, res, next) => {
    try {
        await verifyToken(req, res);
        const nhanVienService = new NhanVienService();
        const result = await nhanVienService.getAllReaders();
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return next(new ApiError(500, 'Lỗi khi lấy danh sách độc giả.'));
    }
}
//[GET] /readers/:id
module.exports.getOneReader = async (req, res, next) => {
    try{
        await verifyToken(req, res)
        const id = req.params.id
        const nhanVienService = new NhanVienService()
        const result = await nhanVienService.getOneReader(id)
        return res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi lấy thông tin 1 độc giả.'))
    }
}
//[PATCH]  /update-status/:id
module.exports.updateStatusReader = async (req, res, next) => {
    try{
        await verifyToken(req, res)
        const id = req.params.id
        const status = req.body?.status
        const nhanVienService = new NhanVienService()
        const result = await nhanVienService.updateStatusReader(id, status)
        return res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi cập nhật trạng thái độc giả.'))
    }
}
//[PATCH] /staffs/change-password
module.exports.changePassword = async (req, res, next) => {
    try{
        const staff = await verifyToken(req, res)
        console.log(staff)
        const {currentPassword, newPassword} = req.body
        const nhanVienService = new NhanVienService()
        const result = await nhanVienService.changePassword(staff._id, currentPassword, newPassword)
        return res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi nhân viên đổi mật khẩu.'))
    }
}
//[DELETE] /staffs/me
module.exports.delete = async (req, res, next) => {
    try{
        const staff = await verifyToken(req, res)
        const nhanVienService = new NhanVienService()
        const result = await nhanVienService.delete(staff._id)
        res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi xóa tài khoản cá nhân.'))
    }
}
//[GET] /readers/list-readers-active
module.exports.getAllReadersActive = async (req, res, next) => {
    try{
        await verifyToken(req, res)
        const nhanVienService = new NhanVienService()
        const result = await nhanVienService.getAllReadersActive()
        res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi lấy danh sách các tài khoản đang hoạt động.'))
    }
}
//[GET] /readers/list-readers-blocked
module.exports.getAllReadersBlocked = async (req, res, next) => {
    try{
        await verifyToken(req, res)
        const nhanVienService = new NhanVienService()
        const result = await nhanVienService.getAllReadersBlocked()
        res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi lấy danh sách các tài khoản bị khóa.'))
    }
}