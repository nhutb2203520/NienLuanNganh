const docGiaModel = require('../models/docgia.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const trangThaiDocGiaModel = require('../models/trangthaidocgia.model')
module.exports = class DocGiaService{

    async register(data){
        const kiemTraDG = await docGiaModel.findOne(
            {
                $or: [{SoDienThoai: data.SoDienThoai.trim()}, {Email: data.Email.trim().toLowerCase()}]
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
            const readerStatus = await trangThaiDocGiaModel.findOne({TenTT: 'active'})
            data.MaTT = readerStatus._id
            const hashedPassword = await bcrypt.hash(data.Password, 10)
            data.Password = hashedPassword
            data.Email = data.Email.toLowerCase()
            const newDG = new docGiaModel(data)
            await newDG.save()
            await newDG.populate('MaTT')
            const {Password, ...docGiaInfo} = newDG._doc
            return {
                docgia: docGiaInfo,
                message: 'Đăng ký tài khoản thành công.'
            }
        }
    }
    async login(data){
        if(!data.SoDienThoai && !data.Email){
            return {
                message: 'Vui lòng nhập số điện thoại hoặc email để đăng nhập.'
            }
        }
        const reader = await docGiaModel.findOne(
            {
                $or: [{SoDienThoai: data.SoDienThoai}, {Email: data.Email}]
            }
        ).populate('MaTT', 'TenTT')
        if(reader && reader.MaTT?.TenTT !== 'active'){
            return {
                message: 'Tài khoản của bạn bị khóa do một số lý do, bạn vui lòng liên hệ thư viên để giải quyết.'
            }
        }
        if(!reader){
            return {
                message: 'Số điện thoại/Email này chưa đăng ký tài khoản'
            }
        }else{
            const isMatch = await bcrypt.compare(data.Password, reader.Password)
            if(!isMatch){
                return {
                    message: 'Mật khẩu không đúng.'
                }
            }
            const {Password, ...readerInfo} = reader._doc
            const token = jwt.sign(readerInfo, process.env.JWT_SECRET || 'NienLuanNganh', { expiresIn: '1h' })
            return {
                token,
                reader: readerInfo,
                message: 'Đăng nhập thành công.'
            }
        }
    }
    async updateAccount(id, data){
        const kiemTraReader = await docGiaModel.findOne(
            {
                _id: {$ne: id},
                $or: [{SoDienThoai: data.SoDienThoai}, {Email: data.Email}]
            }
        )
        if(kiemTraReader){
            return {
                message: 'Số điện thoại hoặc Email đã tồn tại.'
            }
        }
        
        const updatedReader = await docGiaModel.findByIdAndUpdate(id, data,{
            new:true
        }).select('-Password')
        if(!updatedReader){
            return {
                message: 'Độc giả không tồn tại.'
            }
        }else{
            return {
                reader: updatedReader,
                message: 'Cập nhật tài khoản thành công.'
            }
        }
    }
    async deleteAccount(id){
        const account = await docGiaModel.findByIdAndDelete(id).select('-Password')
        if(!account){
            return{
                message: 'Tài khoản không tồn tại.'
            }
        }else{
            return{
                deletedAccount: account,
                message: 'Xóa tài khoản thành công.'
            }
        }
    }
    async changePassword(id, currentPassword, newPassword){
        const reader = await docGiaModel.findById(id)
        if(!reader) {
            return {
                message: 'Người dùng không tồn tại.'
            }
        }else{
            const isMatch = await bcrypt.compare(currentPassword, reader.Password)
            if(!isMatch){
                return {
                    message: 'Mật khẩu cũ không đúng.'
                }
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10)
            reader.Password = hashedPassword
            await reader.save()
            return {
                message: 'Đổi mật khẩu thành công.'
            }
        }
    }
}