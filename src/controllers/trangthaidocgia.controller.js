const ApiError = require('../ApiError')
const TrangThaiDocGiaService = require('../services/trangthaidocgia.service')


module.exports.add = async (req, res, next) => {
    try{
        const data = req.body
        const trangThaiDocGiaService = new TrangThaiDocGiaService()
        const result = await trangThaiDocGiaService.add(data)
        res.status(200).json(result)
    }catch(err) {
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi thêm trạng thái độc giả.'))
    }
}