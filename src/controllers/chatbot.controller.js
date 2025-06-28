const chatbotService = require('../services/chatbot.service');

exports.chat = async (req, res) => {
  const { message } = req.body;
  const MaDocGia = req.user._id

  if (!message) {
    return res.status(400).json({ message: 'Thiếu message hoặc sessionId.' });
  }

  try {
    const answer = await chatbotService.getResponse(message, MaDocGia);
    res.status(200).json({ answer });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xử lý chatbot.', error: error.message });
  }
};
