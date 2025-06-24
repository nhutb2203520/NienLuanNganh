const sachModel = require('../models/sach.model')
const muonSachModel = require('../models/theodoimuonsach.model')
module.exports = class SachService{

    async addBook(data){
        const tenSachCheck = data.TenSach.trim()
        const kiemTraSach = await sachModel.findOne({
            TenSach: { $regex: `^${tenSachCheck}$`, $options: 'i' }
        })

        if (kiemTraSach) {
            return {
            message: `Sách "${data.TenSach}" đã tồn tại.`
            }
        } else {
            data.TenSach = tenSachCheck // không ép thường
            const newSach = new sachModel(data)
            await newSach.save()
            await newSach.populate([
            { path: 'TacGia', select: 'TenTG' },
            { path: 'MaNXB', select: 'TenNXB' },
            { path: 'MaLoai', select: 'TenLoai' },
            { path: 'MaViTri', select: 'TenViTri' }
            ])
            return {
            sach: newSach,
            message: 'Thêm sách thành công.'
            }
        }
        }

    async getAll() {
        const bookList = await sachModel.find()
            .populate([
            { path: 'TacGia', select: 'TenTG' },
            { path: 'MaNXB', select: 'TenNXB' },
            { path: 'MaLoai', select: 'TenLoai' },
            { path: 'MaViTri', select: 'TenViTri' }
            ])
        const countBook = await sachModel.countDocuments()
        if(bookList.length === 0) {
            return {
                message: 'Không có sách.'
            }
        }else{
            return{
                message: 'Lấy danh sách sách thành công.',
                danhsachsach: bookList,
                count: countBook
            }
        }
    }
    async getOne(MaSach){
        const book =  await sachModel.findOne(
            {
                MaSach: MaSach
            }
        ).populate([
            { path: 'TacGia', select: 'TenTG' },
            { path: 'MaNXB', select: 'TenNXB' },
            { path: 'MaLoai', select: 'TenLoai' },
            { path: 'MaViTri', select: 'TenViTri' }
            ])
        if(!book){
            return{
                message: 'Sách không tồn tại.'
            }
        }else{
            return{
                message: 'Lấy thông tin sách thành công.',
                sach: book
            }
        }
    }
    async update(MaSach, data) {
        const book = await sachModel.findOne({MaSach})
        if(!book) {
            return {
                message: 'Sách không tồn tại.'
            }
        }else{
            data.TenSach = data.TenSach.trim()
            const checkBook = await sachModel.findOne({
                MaSach: { $ne: MaSach },
                TenSach: { $regex: `^${data.TenSach}$`, $options: 'i' }
            })

            if(checkBook){
                return {
                    message: 'Tên sách đã tồn tại.'
                }
            }
            const updateBook = await sachModel.findOneAndUpdate({MaSach}, data, {new: true})
            return {
                message: 'Cập nhật sách thành công.',
                sach: updateBook
            }
        }
    }
    async delete(MaSach) {
        const book = await sachModel.findOne({MaSach})
        if(!book) {
            return {
                message: 'Sách không tồn tại.'
            }
        }else{
            const checkBorrowBook = await muonSachModel.findOne({
                MaSach: book._id
            })
            if(checkBorrowBook){
                return {
                    message: 'Có phiếu mượn đang cần thông tin quyển sách này nếu xóa sẽ bị mất dữ liệu, không được xóa.'
                }
            }else{
                const deleteBook = await sachModel.findByIdAndDelete(book._id)
                return {
                    message: `Xóa quyển sách tên "${deleteBook.TenSach}" thành công.`
                }
            }
        }
    }
}