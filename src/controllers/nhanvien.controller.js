const ApiError = require('../ApiError')
const NhanVienService = require('../services/nhanvien.service')

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