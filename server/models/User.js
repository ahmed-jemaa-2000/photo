const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    telegramId: { type: Number, required: true, unique: true },
    username: String,
    credits: { type: Number, default: 0 },
    generationsCount: { type: Number, default: 0 },
    language: { type: String, default: 'en' }, // 'en' or 'tn'
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
