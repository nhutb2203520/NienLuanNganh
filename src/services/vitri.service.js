const vitriModel = require('../models/vitri.model')
const viTriModel = require('../models/vitri.model')

module.exports = class ViTriModel{

    async addPosition(data){
        const kiemTraPosition = await viTriModel.findOne({
            TenViTri: data.TenViTri.trim().toLowerCase()
        })
        if(kiemTraPosition){
            return {
                message: 'Vị trí đã tồn tại.'
            }
        }
        else {
            data.TenViTri = data.TenViTri.trim().toLowerCase()
            const newViTri = new viTriModel(data)
            await newViTri.save()
            return {
                vitri: newViTri,
                message: 'Thêm vị trí thành công.'
            }
        }
    }
    async getAll(){
        const positions = await viTriModel.find()
        const countPosition = await vitriModel.countDocuments()
        if(positions.length === 0) {
            return {
                message: 'Không có vị trí nào.'
            }
        }else{
            return{
                danhsachvitri: positions,
                count: countPosition,
                message: 'Lấy danh sách vị trí thành công.'
            }
        }
    }
    async getOne(MaViTri){
        const position = await viTriModel.findOne(
            {
                MaViTri: MaViTri
            }
        )
        if(!position) {
            return{
                message: 'Vị trí không tồn tại.'
            }
        }else{
            return{
                message: 'Lấy thông tin chi tiết một vị trí thành công.',
                vitri: position
            }
        }
    }
    async update(MaViTri, data){
        const position = await viTriModel.findOne({ MaViTri})
        if(!position){
            return {
                message: 'Vị trí không tồn tại.'
            }
        }else{
            data.TenViTri = data.TenViTri.trim().toLowerCase()
            const kiemTraPosition = await viTriModel.findOne(
                {
                    MaViTri: {$ne: MaViTri},
                    TenViTri: data.TenViTri.trim().toLowerCase()
                }
            )
            if(kiemTraPosition){
                return {
                    message: 'Vị trí đã tồn tại.'
                }
            }
            const updatePosition = await vitriModel.findOneAndUpdate(
                {
                    MaViTri
                },
                data,
                {
                    new: true
                }
            )
            return {
                message: 'Cập nhật vị trí thành công.',
                vitri: updatePosition
            }
        }
    }
    async delete(MaViTri){
        const position = await viTriModel.findOneAndDelete({MaViTri})
        if(!position){
            return{
                message: 'Vị trí không tồn tại.'
            }
        }else{
            return {
               message: `Xóa vị trí tên "${position.TenViTri}" thành công.`
            }
        }
    }
}