const muonSachModel = require("../models/theodoimuonsach.model");
const docGiaModel = require("../models/docgia.model");
const sachModel = require("../models/sach.model");
const trangThaiModel = require("../models/trangthaimuon.model");
const { sendMail } = require('../utils/mailer')
require("dotenv").config();

module.exports = class MuonSachService {
  async getTrangThaiId(tenTrangThai) {
    const trangThai = await trangThaiModel.findOne({
      TenTrangThai: { $regex: `^${tenTrangThai}$`, $options: "i" },
    });
    return trangThai?._id;
  }
  async add({ MaDocGia, MaSach }) {
    // các mã hiện tại là các id
    // 1. Kiểm tra độc giả
    const docGia = await docGiaModel.findById(MaDocGia);
    if (!docGia) return { message: "Độc giả không tồn tại." };

    // 2. Kiểm tra sách
    const sach = await sachModel.findById(MaSach);
    if (!sach) return { message: "Sách không tồn tại." };

    // 3. Kiểm tra số lượng sách còn
    const maTrangThai = await this.getTrangThaiId("đã lấy");
    const newMaTrangThai = await this.getTrangThaiId("chờ lấy");
    if (!maTrangThai) return { message: 'Không tìm thấy trạng thái "đã lấy".' };
    if (!newMaTrangThai)
      return { message: 'Không tìm thấy trạng thái "chờ lấy".' };
    const sachBanDangLay = await muonSachModel.findOne({
      MaSach: MaSach,
      MaTrangThai: maTrangThai,
      MaDocGia: MaDocGia,
    });
    const sachBanDangKyMuon = await muonSachModel.findOne({
      MaSach: MaSach,
      MaTrangThai: newMaTrangThai,
      MaDocGia: MaDocGia,
    });
    if (sachBanDangKyMuon) {
      return {
        message: `Sách "${sach.TenSach}" bạn đã đăng ký mượn vui lòng đến thư viện lấy sách không thể đăng ký mượn nữa.`,
      };
    }
    if (sachBanDangLay) {
      return {
        message: `Sách "${sach.TenSach}" bạn đang mượn không thể đăng ký mượn nữa.`,
      };
    }
    const soLuongTon = sach.SoQuyen - sach.SoLuongDaMuon;
    if (soLuongTon === 0) {
      return {
        message: `Sách "${sach.TenSach}" đã hết.`,
      };
    }
    // 5. Kiểm tra số sách độc giả đang mượn chưa trả
    const soLuongDangMuon = await muonSachModel.countDocuments({
      MaDocGia,
      MaTrangThai: maTrangThai,
    });
    if (soLuongDangMuon >= Number(process.env.MAX_BOOKS_PER_USER)) {
      return {
        message: `Độc giả này đang mượn ${soLuongDangMuon} sách chưa trả. Vượt quá giới hạn ${process.env.MAX_BOOKS_PER_USER}.`,
      };
    }
    //Tạo phiếu mượn
    const newMuonSach = await muonSachModel.create({
      MaDocGia,
      MaSach,
      MaTrangThai: newMaTrangThai,
      ThoiGianChoLay: new Date()
    });
    const html = `
  <h3>Xin chào ${docGia.HoTen},</h3>
  <p>Bạn đã đăng ký mượn sách "${sach.TenSach}". Vui lòng đến lấy trong 24 giờ.</p>`
    sendMail(docGia.Email, 'Thông báo đăng ký mượn sách', html)
    await newMuonSach.populate([
      {
        path: "MaDocGia",
        select: "-Password",
      },
      {
        path: "MaSach",
        populate: [
          {
            path: "TacGia",
            select: "TenTG",
          },
          {
            path: "MaViTri",
            select: "TenViTri",
          },
          {
            path: "MaLoai",
            select: "TenLoai",
          },
          {
            path: "MaNXB",
            select: "TenNXB",
          },
        ],
      },
      {
        path: "MaTrangThai",
        select: "TenTrangThai",
      },
    ]);

    return {
      message: "Tạo phiếu mượn thành công.",
      phieumuon: newMuonSach,
    };
  }
  async getAllForUser(MaDocGia) {
    const docGia = await docGiaModel.findById(MaDocGia);
    if (!docGia) {
      return {
        message: "Vui lòng đăng nhập để có thông tin về độc giả.",
      };
    } else {
      const borrows = await muonSachModel
        .find({
          MaDocGia: MaDocGia,
        })
        .populate([
          {
            path: "MaSach",
            populate: [
              {
                path: "TacGia",
                select: "TenTG",
              },
              {
                path: "MaLoai",
                select: "TenLoai",
              },
              {
                path: "MaViTri",
                select: "TenViTri",
              },
              {
                path: "MaNXB",
                select: "TenNXB",
              },
            ],
          },
          {
            path: "MaTrangThai",
            select: "TenTrangThai",
          },
        ]);
      if (borrows.length === 0) {
        return {
          message: "Độc giả chưa mượn quyển sách nào của thư viện.",
        };
      } else {
        return {
          danhsachmuon: borrows,
          message: "Lấy danh sách mượn thành công.",
        };
      }
    }
  }
  async getAllForAdmin() {
    const borrows = await muonSachModel.find().populate([
      {
        path: "MaSach",
        populate: [
          {
            path: "TacGia",
            select: "TenTG",
          },
          {
            path: "MaLoai",
            select: "TenLoai",
          },
          {
            path: "MaViTri",
            select: "TenViTri",
          },
          {
            path: "MaNXB",
            select: "TenNXB",
          },
        ],
      },
      {
        path: "MaTrangThai",
        select: "TenTrangThai",
      },
    ]);
    const countBorrows = await muonSachModel.countDocuments();
    if (borrows.length === 0) {
      return {
        message: "Chưa có lịch sử mượn sách.",
      };
    } else {
      return {
        danhsachmuon: borrows,
        count: countBorrows,
        message: "Lấy danh sách mượn sách thành công",
      };
    }
  }
  async updateTrangThai(MaMuonSach, trangThaiMoi, MaNhanVien) {
    const muonSach = await muonSachModel.findOne({ MaMuonSach });

    if (!muonSach) {
      return { message: "Phiếu mượn không tồn tại." };
    }
    const trangThaiHienTai = await trangThaiModel.findById(
      muonSach.MaTrangThai
    );
    trangThaiMoi = trangThaiMoi.trim();
    const trangThaiMoiDoc = await trangThaiModel.findOne({
      TenTrangThai: { $regex: `^${trangThaiMoi}$`, $options: "i" },
    });

    if (!trangThaiMoiDoc) {
      return { message: `Trạng thái mới "${trangThaiMoi}" không tồn tại.` };
    }

    const tenTrangThaiHienTai =
      trangThaiHienTai?.TenTrangThai?.trim().toLowerCase();
    const tenTrangThaiMoi = trangThaiMoiDoc.TenTrangThai.trim().toLowerCase();

    // Kiểm tra logic chuyển trạng thái hợp lệ
    const hopLe =
      (tenTrangThaiHienTai === "chờ lấy" && tenTrangThaiMoi === "đã lấy") ||
      (tenTrangThaiHienTai === "đã lấy" && tenTrangThaiMoi === "đã trả");

    if (!hopLe) {
      return {
        message: `Không thể chuyển từ trạng thái "${tenTrangThaiHienTai}" sang "${tenTrangThaiMoi}".`,
      };
    }
    const sach = await sachModel.findById(muonSach.MaSach)
    // Nếu chuyển sang 'đã lấy' thì cập nhật ngày mượn
    if (tenTrangThaiMoi === "đã lấy") {
      const ngayHienTai = new Date();
      muonSach.NgayMuon = ngayHienTai;

      const ngayTraTuDong = new Date(ngayHienTai);
      ngayTraTuDong.setDate(ngayTraTuDong.getDate() + 3);
      muonSach.NgayTra = ngayTraTuDong;
      sach.SoLuongDaMuon = (sach.SoLuongDaMuon || 0) + 1;
      sach.SoLuotMuon = (sach.SoLuotMuon || 0) + 1;
      await sach.save()
    }
    // Nếu chuyển sang 'đã trả' thì cập nhật ngày trả
    if (tenTrangThaiMoi === "đã trả") {
      muonSach.NgayTra = new Date();
      sach.SoLuongDaMuon -= 1
      await sach.save() 
    }

    muonSach.MaTrangThai = trangThaiMoiDoc._id;
    muonSach.MaNhanVien = MaNhanVien;
    await muonSach.save();

    await muonSach.populate([
      {
        path: "MaDocGia",
        select: "-Password",
      },
      {
        path: "MaSach",
        populate: [
          { path: "TacGia", select: "TenTG" },
          { path: "MaLoai", select: "TenLoai" },
          { path: "MaViTri", select: "TenViTri" },
          { path: "MaNXB", select: "TenNXB" },
        ],
      },
      {
        path: "MaTrangThai",
        select: "TenTrangThai",
      },
      {
        path: "MaNhanVien",
        select: "-Password",
      },
    ]);

    return {
      message: `Cập nhật trạng thái phiếu mượn thành công.`,
      phieumuon: muonSach,
    };
  }
  async getAllBorrowDeadline(){
    const trangThaiDaLay = await this.getTrangThaiId('đã lấy')
    if(!trangThaiDaLay){
      return{
        message: 'Trạng thái không hợp lệ.'
      }
    }
    const ngayHienTai = new Date()
    const ngayMai = new Date()
    ngayMai.setDate(ngayHienTai.getDate() + 1)
    const phieuMuonSapHetHan = await muonSachModel.find(
      {
        MaTrangThai: trangThaiDaLay,
        NgayTra: {
          $gte: ngayHienTai,
          $lte: ngayMai
        }
      }
    ).populate([
      { path: "MaDocGia", select: "-Password" },
      {
          path: "MaSach",
          populate: [
              { path: "TacGia", select: "TenTG" },
              { path: "MaLoai", select: "TenLoai" },
              { path: "MaViTri", select: "TenViTri" },
              { path: "MaNXB", select: "TenNXB" },
          ]
      },
      { path: "MaTrangThai", select: "TenTrangThai" }
    ])
    if(phieuMuonSapHetHan.length === 0) {
      return {
        message: 'Không có phiếu mượn nào sắp đến hạn.'
      }
    }
    return {
        message: `Có ${phieuMuonSapHetHan.length} phiếu mượn sắp đến hạn.`,
        danhsach: phieuMuonSapHetHan,
    };
  }
  async sendEmailToReader(MaMuonSach){
    const muon = await muonSachModel.findOne({MaMuonSach}).populate([
      {
        path: "MaDocGia",
        select: "-Password"
      },
      {
        path: "MaSach"
      }
    ])
    if(!muon){
      return {
        message: 'Phiếu mượn không tồn tại.'
      }
    }else{
      const html = `<h3>Xin chào ${muon.MaDocGia.HoTen},</h3>
        <p>Bạn đã mượn sách "${muon.MaSach.TenSach}" và sẽ đến hạn trả vào <strong>${new Date(muon.NgayTra).toLocaleDateString()}</strong>.</p>
        <p>Vui lòng đến trả đúng hạn để không bị xử lý quá hạn.</p>
      `
      const docGia = await docGiaModel.findById(muon.MaDocGia)
      await sendMail(docGia.Email, 'Thông báo hạn trả sách', html)
      return{
        message: 'Gửi email thông báo hạn trả sách thành công.'
      }
    }
  }
  async extendBorrow(MaMuonSach){
    const muonSach = await muonSachModel.findOne({ MaMuonSach }).populate([
      { path: "MaDocGia", select: "-Password" },
      { path: "MaSach" }
    ]);
    if(!muonSach){
      return{
        message: 'Phiếu mượn không tồn tại.'
      }
    }
    const trangThai = await trangThaiModel.findById(muonSach.MaTrangThai)
    const tenTrangThai = trangThai?.TenTrangThai?.toLocaleLowerCase()
    if(tenTrangThai !== 'đã lấy'){
      return { message: "Chỉ được gia hạn khi sách đang ở trạng thái 'đã lấy'." };
    }
     if (muonSach.DaGiaHan) {
      return { message: "Phiếu mượn này đã được gia hạn một lần rồi, không thể gia hạn nữa." };
    }
    // Gia hạn thêm 3 ngày
    const ngayTraMoi = new Date(muonSach.NgayTra);
    ngayTraMoi.setDate(ngayTraMoi.getDate() + 3);
    muonSach.NgayTra = ngayTraMoi;
    muonSach.DaGiaHan = true;
    await muonSach.save();
    
    const html = `<h3>Xin chào ${muonSach.MaDocGia.HoTen},</h3>
    <p>Quyển sách "${muonSach.MaSach.TenSach}" của bạn đã được gia hạn.</p>
    <p>Hạn trả mới là: <strong>${ngayTraMoi.toLocaleDateString()}</strong>.</p>`;

    await sendMail(muonSach.MaDocGia?.Email, "Gia hạn mượn sách", html);

    return {
      message: "Gia hạn mượn sách thành công.",
      ngayTraMoi: muonSach.NgayTra
    };
  }
};
