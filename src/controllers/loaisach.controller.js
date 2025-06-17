const ApiError = require('../ApiError')
const LoaiSachService = require('../services/loaisach.service')

module.exports.addLoaiSach = async (req, res, next) => {
    try{
        const  data = req.body
        const loaiSachService = new LoaiSachService()
        const result = await loaiSachService.addLoaiSach(data)
        return res.status(200).json(result)
    }catch(err) {
        console.log(err)
        return next(new ApiError(500, 'Có lỗi khi thêm loại sách.'))
    }
}