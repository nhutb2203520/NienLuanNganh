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
module.exports.updateAccountStaff = async (req, res, next) => {
    try{
        await verifyToken(req, res)
        const id = req.params.id
        const data = req.body
        const nhanVienService = new NhanVienService()
        const result = await nhanVienService.updateAccountStaff(id, data)
        return res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi Khi cập nhật tài khoản nhân viên.'))
    }
}
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
module.exports.deleteOneReader = async (req, res, next) => {
    try{
        await verifyToken(req, res)
        const id = req.params.id
        const nhanVienService = new NhanVienService()
        const result = await nhanVienService.deleteOneReader(id)
        return res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi xóa độc giả.'))
    }
}
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
