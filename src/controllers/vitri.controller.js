const ApiError = require('../ApiError')
const PositionService = require('../services/vitri.service')

module.exports.addPosition = async (req, res, next) => {
    try{
        const data = req.body
        const positionService = new PositionService()
        const result = await positionService.addPosition(data)
        return res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi thêm vị trí sách.'))
    }
}