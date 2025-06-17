const ApiError = require('../ApiError')
const PublisherService = require('../services/nhaxuatban.service')

module.exports.addPublisher = async (req, res, next) => {
    try{
        const data = req.body
        const publisherService = new PublisherService()
        const result = await publisherService.addPublisher(data)
        return res.status(200).json(result)
    }catch(err){
        console.log(err)
        return next(new ApiError(500, 'Lỗi khi thêm nhà xuất bản.'))
    }
}