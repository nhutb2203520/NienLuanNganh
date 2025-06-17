const loaiSachModel = require('../models/loaisach.model')

module.exports = class LoaiSachService{
    

    async addLoaiSach(data) {
        const kiemTraLS = await loaiSachModel.findOne({
            TenLoai: data.TenLoai.trim()
        })
        if(kiemTraLS){
            return{
                message: 'Loại sách đã tồn tại.'
            }
        }else{
            const newLoaiSach = new loaiSachModel(data)
            await newLoaiSach.save()
            return {
                loaisach: newLoaiSach,
                message: 'Thêm loại sách thành công.'
            }
        }
    }
}