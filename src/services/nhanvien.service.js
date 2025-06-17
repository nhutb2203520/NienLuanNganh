const nhanVienModel = require('../models/nhanvien.model')

module.exports = class NhanVienService{

    async register(data){
        const kiemTraNV = await nhanVienModel.findOne(
            {
                $or: [{SoDienThoai: data.SoDienThoai},{Email: data.Email}]
            }
        )
        if(kiemTraNV){
            return{
                message: 'Số điện thoại hoặc Email đã đăng ký tài khoản nhân viên.'
            }
        }else{
            if(!data.HoTenNV){
                return{
                    message: 'Họ tên nhân viên không được để trống.'
                }
            }
            /// băm mật khẩu
            const newNV = new nhanVienModel(data)
            await newNV.save()
            return {
                nhanvien: newNV,
                message: 'Đăng ký tài khoản nhân viên thành công.'
            }
        }
    }
}