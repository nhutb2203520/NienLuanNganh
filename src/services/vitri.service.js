const viTriModel = require('../models/vitri.model')

module.exports = class ViTriModel{

    async addPosition(data){
        const kiemTraPosition = await viTriModel.findOne({
            TenViTri: data.TenViTri.trim()
        })
        if(kiemTraPosition){
            return {
                message: 'Vị trí đã tồn tại.'
            }
        }
        else {
            const newViTri = new viTriModel(data)
            await newViTri.save()
            return {
                vitri: newViTri,
                message: 'Thêm vị trí thành công.'
            }
        }
    }
}