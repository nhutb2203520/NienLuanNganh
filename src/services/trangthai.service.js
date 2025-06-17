const trangThaiModel = require('../models/trangthai.model')

module.exports = class TrangThaiService{

    async addTrangThai(data){
        const kiemTraTrangThai = await trangThaiModel.findOne(
            {
                TenTrangThai: data.TenTrangThai.trim()
            }
        )
        if(kiemTraTrangThai){
            return{
                message: 'Trạng thái đã tồn tại'
            }
        }else{
            const newTrangThai = new trangThaiModel(data)
            await newTrangThai.save()
            return{
                trangthai: newTrangThai,
                message: 'Thêm trạng thái thành công.'
            }
        }
    }
}