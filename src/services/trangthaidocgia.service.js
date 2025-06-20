const trangThaiDocGiaModel = require('../models/trangthaidocgia.model')


module.exports = class TrangThaiDocGiaService{

    async add(data){
        const status = await trangThaiDocGiaModel.findOne({
            TenTT: data.TenTT.trim()
        })
        if(status){
            return{
                message: 'Trạng thái đã tồn tại.'
            }
        }else{
            const newStatus = new trangThaiDocGiaModel(data)
            await newStatus.save()
            return{
                message:'Thêm trạng thái thành công.',
                newStatus
            }
        }

    }
}