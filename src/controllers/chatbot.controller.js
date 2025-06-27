const chatbotService = require('../services/chatbot.service');

exports.chat = async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message || !sessionId) {
    return res.status(400).json({ message: 'Thiếu message hoặc sessionId.' });
  }

  try {
    const answer = await chatbotService.getResponse(message, sessionId);
    res.status(200).json({ answer });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xử lý chatbot.', error: error.message });
  }
};
