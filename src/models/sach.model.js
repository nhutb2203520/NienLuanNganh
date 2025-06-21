const mongoose = require('mongoose')
const counterModel = require('./counter')

const sachSchema = new mongoose.Schema(
    {
        MaSach: {type: String, unique: true},
        TenSach: {type: String, required: true},
        SoQuyen: {type: Number, required: true},
        NamXuatBan: {type: String, required: true},
        TacGia: [{type: mongoose.Schema.Types.ObjectId, ref: 'bangTacGia', required: true}], // mảng tác giả
        SoLuongDaMuon: {type: Number, default: 0},
        SoLuotMuon: {type: Number, default: 0},
        MaNXB: {type: mongoose.Schema.Types.ObjectId, ref: 'bangNXB', required: true},
        MaLoai: {type: mongoose.Schema.Types.ObjectId, ref: 'bangLoaiSach', required: true},
        MaViTri: {type: mongoose.Schema.Types.ObjectId, ref: 'bangViTri', required: true}
    },{
        timestamps: true,
        minimize: false,
        collection: 'SACH'
    }
)
sachSchema.pre('save', async function(next) {
    if(this.isNew){
        const counter = await counterModel.findOneAndUpdate(
            {
                _id: 'sach'
            },
            {
                $inc: {seq: 1}
            },
            {
                new: true,
                upsert: true
            }
        )
        this.MaSach = 'S' + String(counter.seq).padStart(4, '0')
    }
    next()
})

module.exports = mongoose.model('bangSach', sachSchema)