const mongoose = require('mongoose')
const counterModel = require('./counter')

const muonSachSchema = new mongoose.Schema(
    {
        MaMuonSach: {type: String, unique: true},
        NgayMuon: {type: Date, required: true, default: Date.now()},
        NgayTra: {type: Date},
        SoLuongMuon: {type: Number, default: 1, required: true},
        MaTrangThai: {type: mongoose.Schema.Types.ObjectId, ref: 'bangTrangThai', required: true},
        MaDocGia: {type: mongoose.Schema.Types.ObjectId, ref: 'bangDocGia', required: true},
        MaNhanVien: {type: mongoose.Schema.Types.ObjectId, ref: 'bangNhanVien'}
    },
    {
        timestamps: true,
        minimize: false,
        collection: 'THEODOIMUONSACH'
    }
)
muonSachSchema.pre('save', async function(next){
    if(this.isNew){
        const counter = await counterModel.findOneAndUpdate(
            {
                _id: 'muonsach'
            },
            {
                $inc: {seq: 1}
            },
            {
                new: true,
                upsert: true
            }
        )
        this.MaMuonSach = 'PM' + String(counter.seq).padStart(4, '0')
    }
    next()
})
module.exports = mongoose.model('bangMuonSach', muonSachSchema)