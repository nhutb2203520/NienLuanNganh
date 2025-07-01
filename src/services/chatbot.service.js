const { OpenAI } = require("openai");
const Sach = require("../models/sach.model");
const TacGia = require("../models/tacgia.model");
const NhaXuatBan = require("../models/nhaxuatban.model");
const LoaiSach = require("../models/loaisach.model");
const ChatLog = require("../models/chatlog.model");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const sessions = {};

// === Normalize text to compare ===
const normalize = (str) =>
  (str || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

// === Detect user intent ===
function detectIntent(message, authors, publishers) {
  const norm = normalize(message);
  const isAskingQuantity =
    /bao nhieu|tổng số|số lượng|co bao nhieu|co may/.test(norm);
  const matchedAuthor = authors.find((a) => norm.includes(normalize(a.TenTG)));
  const matchedPublisher = publishers.find((p) =>
    norm.includes(normalize(p.TenNXB))
  );

  return { isAskingQuantity, matchedAuthor, matchedPublisher };
}

// === Ghi log + lưu session ===
async function saveAndReturnReply(MaDocGia, userMessage, reply) {
  const history = sessions[MaDocGia] || [];
  history.push({ role: "user", content: userMessage });
  history.push({ role: "assistant", content: reply });
  sessions[MaDocGia] = history;

  await ChatLog.create({ MaDocGia, question: userMessage, answer: reply });
  return reply;
}

class ChatbotService {
  static async getResponse(message, MaDocGia) {
    const userMessage = message.toLowerCase();
    const history = sessions[MaDocGia] || [];

    // Load dữ liệu
    const [allBooks, allAuthors, allPublishers, allTypes] = await Promise.all([
      Sach.find({}, "TenSach TacGia MaNXB MaLoai"),
      TacGia.find({}, "_id TenTG"),
      NhaXuatBan.find({}, "_id TenNXB DiaChi"),
      LoaiSach.find({}, "_id TenLoai"),
    ]);

    const { isAskingQuantity, matchedAuthor, matchedPublisher } = detectIntent(
      userMessage,
      allAuthors,
      allPublishers
    );

    // 👉 Trường hợp hỏi số lượng sách theo tác giả
    if (isAskingQuantity && matchedAuthor) {
      const count = await Sach.countDocuments({ TacGia: matchedAuthor._id });
      const reply = `📘 Tác giả **${matchedAuthor.TenTG}** có khoảng **${count} đầu sách** trong thư viện.`;
      return await saveAndReturnReply(MaDocGia, userMessage, reply);
    }

    // 👉 Trường hợp hỏi số lượng sách theo nhà xuất bản
    if (isAskingQuantity && matchedPublisher) {
      const count = await Sach.countDocuments({ MaNXB: matchedPublisher._id });
      const reply = `🏢 Nhà xuất bản **${matchedPublisher.TenNXB} địa chỉ: ${matchedPublisher.DiaChi}** có khoảng **${count} cuốn sách** trong thư viện.`;
      return await saveAndReturnReply(MaDocGia, userMessage, reply);
    }

    // 👉 Trường hợp hỏi tổng số sách
    if (
      isAskingQuantity &&
      !matchedAuthor &&
      !matchedPublisher &&
      /sach|sách/.test(normalize(userMessage))
    ) {
      const totalBooks = await Sach.countDocuments({});
      const reply = `📚 Thư viện hiện có tổng cộng khoảng **${totalBooks} đầu sách** khác nhau. Bạn muốn tìm sách gì cụ thể không?`;
      return await saveAndReturnReply(MaDocGia, userMessage, reply);
    }

    // Tìm kiếm theo tên sách, tác giả, NXB, thể loại
    const normMsg = normalize(userMessage);
    const matchedBookTitles = allBooks
      .map((b) => b.TenSach)
      .filter((title) => normMsg.includes(normalize(title)));

    let query = {};

    if (matchedBookTitles.length) {
      query.TenSach = { $in: matchedBookTitles };
    } else if (matchedAuthor) {
      query.TacGia = matchedAuthor._id;
    } else if (matchedPublisher) {
      query.MaNXB = matchedPublisher._id;
    }

    const sachList = await Sach.find(query)
      .limit(5)
      .populate("TacGia")
      .populate("MaNXB")
      .populate("MaLoai");

    const found = sachList.length > 0;

    // Soạn nội dung sách đưa vào GPT
    let sachText = found
      ? sachList
          .map((s) => {
            let tacgia = Array.isArray(s.TacGia)
              ? s.TacGia.map((t) => t.TenTG).join(", ")
              : s.TacGia?.TenTG || "Không rõ";

            return `📘 "${s.TenSach}"\nTác giả: ${tacgia}\nNXB: ${
              s.MaNXB?.TenNXB || "Không rõ"
            } (${s.MaNXB?.DiaChi || "Không rõ"})\nThể loại: ${
              s.MaLoai?.TenLoai || "Không rõ"
            }\nNăm XB: ${s.NamXuatBan || "Không rõ"}\nCòn lại: ${
              s.SoQuyen - s.SoLuongDaMuon
            } cuốn`;
          })
          .join("\n\n---\n\n")
      : "Không có dữ liệu sách phù hợp.";

    if (!matchedBookTitles.length && !matchedAuthor && !matchedPublisher) {
      sachText =
        "Chưa rõ bạn cần tìm sách nào. Bạn có thể hỏi theo tên sách, tác giả, thể loại,... để mình hỗ trợ tốt hơn nhé.";
    }

    // Gửi cho GPT xử lý
    const systemPrompt = `Bạn là trợ lý AI của thư viện. Trả lời chính xác dựa trên dữ liệu được cung cấp bên dưới, không tự suy đoán hoặc bịa đặt.`;
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "system", content: `Dữ liệu sách từ thư viện:\n${sachText}` },
      ...history.slice(-5),
      { role: "user", content: userMessage },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "🤖 Xin lỗi, hiện tại tôi không thể phản hồi.";

    return await saveAndReturnReply(MaDocGia, userMessage, reply);
  }
}

module.exports = ChatbotService;
