const { OpenAI } = require("openai");
const Sach = require("../models/sach.model");
const TacGia = require("../models/tacgia.model");
const NhaXuatBan = require("../models/nhaxuatban.model");
const LoaiSach = require("../models/loaisach.model");
const ChatLog = require("../models/chatlog.model");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const sessions = {};

class ChatbotService {
  static async getResponse(message, MaDocGia) {
    const userMessage = message.toLowerCase();
    const history = sessions[MaDocGia] || [];
    // Chuẩn hóa để so sánh
    const normalize = (str) =>
      (str || "")
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    const normalizedMessage = normalize(userMessage);
    // 👉 Phát hiện câu hỏi về số lượng sách trong thư viện
    if (
      normalizedMessage.includes("bao nhieu sach") ||
      normalizedMessage.includes("bao nhiêu sách") ||
      normalizedMessage.includes("tong so sach") ||
      normalizedMessage.includes("tổng số sách") ||
      normalizedMessage.includes("thu vien co bao nhieu") ||
      normalizedMessage.includes("có bao nhiêu sách")
    ) {
      const totalBooks = await Sach.countDocuments({});
      const reply = `📚 Thư viện hiện có tổng cộng khoảng **${totalBooks} đầu sách** khác nhau. Bạn muốn tìm sách gì cụ thể không?`;

      // Lưu session + log
      history.push({ role: "user", content: userMessage });
      history.push({ role: "assistant", content: reply });
      sessions[MaDocGia] = history;

      await ChatLog.create({
        MaDocGia,
        question: userMessage,
        answer: reply,
      });

      return reply;
    }

    // Lấy tất cả tên sách
    const allBooks = await Sach.find({}, "TenSach");
    let matchedBookTitles = [];

    for (let book of allBooks) {
      const bookName = normalize(book.TenSach);
      if (normalizedMessage.includes(bookName)) {
        matchedBookTitles.push(book.TenSach);
      }
    }
    // Lấy tất cả tên tac giả
    const allAuthors = await TacGia.find({}, "_id TenTG");
    let matchedAuthorNames = [];
    const allAuthorsId = [];
    for (let author of allAuthors) {
      const authorName = normalize(author.TenTG);
      if (normalizedMessage.includes(authorName)) {
        allAuthorsId.push(author._id);
        matchedAuthorNames.push(author.TenTG);
      }
    }
    // lấy danh sách nhà xuất bản
    const allPublishers = await NhaXuatBan.find({}, "_id TenNXB");
    let matchedPublisherNames = [];
    const allPublishersId = [];
    for (let publisher of allPublishers) {
      const publisherName = normalize(publisher.TenNXB);
      if (normalizedMessage.includes(publisherName)) {
        allPublishersId.push(publisher._id);
        matchedPublisherNames.push(author.TenNXB);
      }
    }
    let query = {};

    if (matchedBookTitles.length > 0) {
      // Nếu tìm thấy tên sách nằm trong câu người dùng
      query = { TenSach: { $in: matchedBookTitles } };
    } else if (matchedAuthorNames.length > 0) {
      // Nếu tìm thấy tên tác giả nằm trong câu người dùng
      query = { TacGia: { $in: allAuthorsId } };
    } else if (matchedPublisherNames.length > 0) {
      // Nếu tìm thấy tên nhà xuất bản nằm trong câu người dùng
      query = { MaNXB: { $in: allPublishersId } };
    }
    // Tìm sách
    const sachList = await Sach.find(query)
      .limit(5)
      .populate({ path: "TacGia" })
      .populate({ path: "MaNXB" })
      .populate({ path: "MaLoai" });
    //kiem tra có tìm được sahcs không
    console.log("🔍 Kết quả tìm được:", sachList);

    const found = sachList.length > 0;

    let sachText = found
      ? sachList
          .map((s) => {
            let tacgia = "Không rõ";
            if (Array.isArray(s.TacGia)) {
              tacgia = s.TacGia.map((t) => {
                const name = t.TenTG || "Không rõ";
                const desc = t.MoTa ? ` (${t.MoTa})` : "";
                return name + desc;
              }).join(", ");
            } else if (s.TacGia?.TenTG) {
              tacgia = s.TacGia.TenTG;
              if (s.TacGia.MoTa) tacgia += ` (${s.TacGia.MoTa})`;
            }

            return `📘 Mình tìm thấy một cuốn sách phù hợp: **"${s.TenSach}"**.
        Tác giả: **${tacgia}**  
        Nhà xuất bản: **${s.MaNXB?.TenNXB || "Không rõ"} (Địa chỉ ${
              s.MaNXB?.DiaChi || "Không rõ"
            } )**  
        Mô tả: **${s.MoTa || "Không rõ"}**
        Thể loại: **${s.MaLoai?.TenLoai || "Không rõ"}**, phát hành năm **${
              s.NamXuatBan
            }**.  
        Hiện còn **${
          s.SoQuyen - s.SoLuongDaMuon
        } cuốn** trong thư viện để bạn mượn.`;
          })
          .join("\n\n---\n\n")
      : "Thư viện hiện không có sách phù hợp.";
    if (
      !matchedBookTitles.length &&
      !matchedAuthorNames.length &&
      !matchedPublisherNames.length
    ) {
      sachText =
        "Hiện chưa rõ bạn đang cần tìm loại sách nào cụ thể. Tuy nhiên thư viện có nhiều sách thuộc các lĩnh vực như văn học, công nghệ, khoa học, lịch sử,... Bạn có thể hỏi rõ hơn để mình hỗ trợ tốt hơn nhé!";
    }

    // Gửi cho GPT nếu cần phản hồi thêm
    const messages = [
      {
        role: "system",
        content: `Bạn là trợ lý AI cho thư viện Nhân Nhựt. Trả lời dựa **chính xác vào dữ liệu sách dưới đây**, không tự suy đoán hay bịa đặt nếu không có dữ liệu.`,
      },
      {
        role: "system",
        content: `Dữ liệu sách từ thư viện:\n${sachText}`,
      },
      ...history.slice(-5),
      { role: "user", content: userMessage },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "Xin lỗi, tôi không thể phản hồi lúc này.";

    // Cập nhật session
    history.push({ role: "user", content: userMessage });
    history.push({ role: "assistant", content: reply });
    sessions[MaDocGia] = history;

    // Ghi lại log
    await ChatLog.create({
      MaDocGia,
      question: userMessage,
      answer: reply,
    });

    return reply;
  }
}
module.exports = ChatbotService;
