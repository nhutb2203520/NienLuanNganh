const sachModel = require('../models/sach.model')

module.exports = class SachService{

    async addBook(data){
        const kiemTraSach = await sachModel.findOne({
            TenSach: data.TenSach.trim()
        })
        if(kiemTraSach){
            return{
                message: 'Sách đã tồn tại.'
            }
        }else{
            const newSach = new sachModel(data)
            await newSach.save()
            await newSach.populate(['TacGia', 'MaNXB', 'MaLoai', 'MaViTri'], ['TenTG', 'TenNXB', 'TenLoai', 'TenViTri'])
                    
            return {
                sach: newSach,
                message: 'Thêm sách thành công.'
            }
        }
    }
    async getAll() {
        const bookList = await sachModel.find()
            .populate(['TacGia', 'MaNXB', 'MaLoai', 'MaViTri'], ['TenTG', 'TenNXB', 'TenLoai', 'TenViTri'])
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
        ).populate(['TacGia', 'MaNXB', 'MaLoai', 'MaViTri'], ['TenTG', 'TenNXB', 'TenLoai', 'TenViTri'])
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
}