const ApiError = require('../ApiError')
const SachService = require('../services/sach.service')

//[POST] /books
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
//[GET] /books
module.exports.getAll = async (req, res, next) => {
    try {
        const sachService = new SachService();
        const book = await sachService.getAll();
        res.status(201).json(book);
    } catch (error) {
        console.log(error)
        next(new ApiError(500, "Lỗi khi lấy danh sách sách."));
    }
}
//[GET] /books/:MaSach
module.exports.getOne = async (req, res, next) => {
    try {
        const MaSach = req.params?.MaSach
        const sachService = new SachService();
        const book = await sachService.getOne(MaSach);
        res.status(201).json(book);
    } catch (error) {
        console.log(error)
        next(new ApiError(500, "Lỗi khi lấy thông tin sách."));
    }
}