const loaiSachModel = require('../models/loaisach.model')

module.exports = class LoaiSachService{
    

    async addLoaiSach(data) {
        const kiemTraLS = await loaiSachModel.findOne({
            TenLoai: data.TenLoai.trim().toLowerCase()
        })
        if(kiemTraLS){
            return{
                message: 'Loại sách đã tồn tại.'
            }
        }else{
            data.TenLoai = data.TenLoai.trim().toLowerCase()
            const newLoaiSach = new loaiSachModel(data)
            await newLoaiSach.save()
            return {
                loaisach: newLoaiSach,
                message: 'Thêm loại sách thành công.'
            }
        }
    }
    async getAll() {
        const categorys = await loaiSachModel.find()
        if(categorys.length === 0){
            return{
                message: 'Chưa có loại sách nào.'
            }
        }else{
            return{
                message: 'Lấy danh sách loại sách thành công.',
                danhsachloaisach: categorys
            }
        }
    }
}