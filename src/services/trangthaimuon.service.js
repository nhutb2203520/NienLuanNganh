const trangThaiModel = require('../models/trangthaimuon.model')

module.exports = class TrangThaiService{

    async addTrangThai(data){
        if(data.TenTrangThai.trim().toLowerCase() !== 'chờ lấy' 
        && data.TenTrangThai.trim().toLowerCase() !== 'đã lấy' 
        && data.TenTrangThai.trim().toLowerCase() !== 'đã trả'){
            return {
                message: 'Hệ thống chỉ chấp nhận 3 trạng thái "chờ lấy", "đã lấy" và "đã trả".'
            }
        }
        const kiemTraTrangThai = await trangThaiModel.findOne(
            {
                TenTrangThai: data.TenTrangThai.trim().toLowerCase()
            }
        )
        if(kiemTraTrangThai){
            return{
                message: 'Trạng thái đã tồn tại'
            }
        }else{
            data.TenTrangThai = data.TenTrangThai.trim().toLowerCase()
            const newTrangThai = new trangThaiModel(data)
            await newTrangThai.save()
            return{
                trangthai: newTrangThai,
                message: 'Thêm trạng thái thành công.'
            }
        }
    }
    async getAll(){
        const states = await trangThaiModel.find()
        const countState = await trangThaiModel.countDocuments()
        if(states.length === 0){
            return {
                message: 'Chưa có trạng thái sách nào.'
            }
        }else{
            return {
                danhsachtrangthai: states,
                message: 'Lấy danh sách trạng thái thành công.',
                count: countState
            }
        }
    }
    async getOne(MaTrangThai) {
        const stateDetail = await trangThaiModel.findOne({MaTrangThai})
        if(!stateDetail){
            return{
                message: 'Trạng thái sách không tồn tại.'
            }
        }else{
            return {
                trangthaisach: stateDetail,
                message: 'Lấy thông tin chi tiết trạng thái sách thành công.'
            }
        }
    }
    async delete(MaTrangThai){
        const deleteState = await trangThaiModel.findOneAndDelete({MaTrangThai})
        if(!deleteState){
            return {
                message: 'Trạng thái không tồn tại.'
            }
        }else{
            return {
                message: `Xóa trạng thái tên "${deleteState.TenTrangThai}" thành công.`
            }
        }
    }
}