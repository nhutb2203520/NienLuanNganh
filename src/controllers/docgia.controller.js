const ApiError = require('../ApiError')
const DocGiaService = require('../services/docgia.service')

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