const ApiError = require('../ApiError')
const SachService = require('../services/sach.service')

module.exports.addBook = async (req, res, next) => {
    try {
        const sachService = new SachService();
        const book = await sachService.addBook(req.body);
        res.status(201).json(book);
    } catch (error) {
        console.log(error)
        next(new ApiError(500, "Lỗi khi thêm sách."));
    }
}