const sachModel = require('../models/sach.model')

module.exports = class SachService{

    async addBook(data){
        const kiemTraSach = await sachModel.findOne({
           $and: [{TenSach: data.TenSach.trim()},{TacGia: data.TacGia.trim()}] 
        })
        if(kiemTraSach){
            return{
                message: 'Sách đã tồn tại.'
            }
        }else{
            const newSach = new sachModel(data)
            await newSach.save()
            return {
                sach: newSach,
                message: 'Thêm sách thành công.'
            }
        }
    }
}