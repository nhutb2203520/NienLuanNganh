const docGiaModel = require('../models/docgia.model')

module.exports = class DocGiaService{

    async register(data){
        const kiemTraDG = await docGiaModel.findOne(
            {
                $or: [{SoDienThoai: data.SoDienThoai}, {Email: data.Email}]
            }
        )
        if(kiemTraDG){
            return{
                message: 'Số điện thoại hoặc email đã đăng ký tài khoản.'
            }
        }else{
            if(!data.HoTen){
                return{
                    message: 'Họ tên không được để trống.'
                }
            }
            // băm mật khẩu
            const newDG = new docGiaModel(data)
            await newDG.save()
            return {
                docgia: newDG,
                message: 'Đăng ký tài khoản thành công.'
            }
        }
    }
}