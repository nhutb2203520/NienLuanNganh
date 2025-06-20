const ApiError  = require('../ApiError')
const TrangThaiService = require('../services/trangthaisach.service')


module.exports.addTrangThai = async (req, res, next) => {
    try{
        const data = req.body
        const trangThaiService = new TrangThaiService()
        const result = await trangThaiService.addTrangThai(data)
        return res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi thêm trạng thái.'))
    }
}