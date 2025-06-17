const nhaXuatBanModel = require('../models/nhaxuatban.model')

module.exports = class NhaXuatBanService{

    async addPublisher(data){
        const kiemTraNXB = await nhaXuatBanModel.findOne(
            {
                TenNXB: data.TenNXB,
                DiaChi: data.DiaChi
            }
        )
        if(kiemTraNXB){
            return {
                message: 'Nhà xuất bản đã tồn tại.'
            }
        }else{
            const nxb = new nhaXuatBanModel(data)
            await nxb.save()
            return{
                nxb: nxb,
                message: 'Thêm nhà xuất bản thành công'
            }
        }

    }
}