const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    telegramId: { type: Number, required: true, unique: true },
    username: String,
    email: { type: String, default: null },
    credits: { type: Number, default: 0 },
    generationsCount: { type: Number, default: 0 },
    language: { type: String, default: 'en' }, // 'en' or 'tn'
    isBanned: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
