const mongoose = require('mongoose');
const User = require('../models/User');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Helper functions (now Async)
const getUser = async (telegramId) => {
  return await User.findOne({ telegramId });
};

const createUser = async (telegramId, username) => {
  let user = await User.findOne({ telegramId });
  if (!user) {
    user = await User.create({ telegramId, username, credits: 0, generationsCount: 0 });
  }
  return user;
};

const updateCredits = async (telegramId, amount) => {
  return await User.findOneAndUpdate({ telegramId }, { credits: amount }, { new: true });
};

const incrementCredits = async (telegramId, amount) => {
  return await User.findOneAndUpdate({ telegramId }, { $inc: { credits: amount } }, { new: true });
};


const deductCredit = async (telegramId) => {
  const user = await User.findOne({ telegramId });
  if (user && user.credits > 0) {
    user.credits -= 1;
    user.generationsCount += 1;
    await user.save();
    return { success: true, credits: user.credits };
  }
  return { success: false };
};

const refundCredit = async (telegramId) => {
  return await User.findOneAndUpdate({ telegramId }, { $inc: { credits: 1 } }, { new: true });
};

const getCredits = async (telegramId) => {
  const user = await User.findOne({ telegramId });
  return user ? user.credits : 0;
};

const getStats = async () => {
  const totalUsers = await User.countDocuments();
  const result = await User.aggregate([
    { $group: { _id: null, totalGenerations: { $sum: "$generationsCount" } } }
  ]);
  const totalGenerations = result.length > 0 ? result[0].totalGenerations : 0;
  return { total_users: totalUsers, total_generations: totalGenerations };
};

const setLanguage = async (telegramId, lang) => {
  return await User.findOneAndUpdate({ telegramId }, { language: lang }, { new: true });
};

const getAllUsers = async () => {
  return await User.find({});
};


module.exports = {
  connectDB,
  getUser,
  createUser,
  updateCredits,
  deductCredit,
  refundCredit,
  getCredits,
  getStats,
  getCredits,
  getStats,
  setLanguage,
  incrementCredits,
  getAllUsers
};

