const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema({
    sessionId: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true }
    },
    {
        timestamps: true,
        collection: 'CHATLOG'
    }
);

module.exports = mongoose.model('ChatLog', chatLogSchema);
