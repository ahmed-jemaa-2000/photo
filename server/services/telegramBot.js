const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const db = require('../db/database');
const geminiService = require('./geminiService');
const { PRESET_PROMPTS, POSE_PROMPTS, SHOE_POSE_PROMPTS, BACKDROP_PROMPTS } = require('../config/botConfig');

const locales = require('../config/locales');
const { extractColorPalette } = require('../utils/serverColorExtraction');
const { getColorName } = require('../utils/colorNaming');


const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
  console.warn('TELEGRAM_BOT_TOKEN is not set. Bot will not start.');
}

const bot = BOT_TOKEN ? new Telegraf(BOT_TOKEN) : null;

// User state to track flow
const userState = new Map();

// Helper to chunk array for grid layout
const chunk = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size));

// Helper for translation
const t = (key, lang = 'en', params = {}) => {
  let text = locales[lang]?.[key] || locales['en'][key] || key;
  // Handle nested keys (e.g. buttons.female)
  if (!locales[lang]?.[key] && key.includes('.')) {
    const [parent, child] = key.split('.');
    text = locales[lang]?.[parent]?.[child] || locales['en'][parent]?.[child] || key;
  }

  Object.keys(params).forEach(param => {
    text = text.replace(`{${param}}`, params[param]);
  });
  return text;
};

if (bot) {
  bot.start(async (ctx) => {
    const user = ctx.from;
    let dbUser = await db.createUser(user.id, user.username);

    // If language not set (or default 'en' but we want to force choice first time? No, let's just offer choice)
    // Actually, let's show language picker if it's a new user or they explicitly ask

    // For now, simple start message with language toggle
    const lang = dbUser.language || 'en';

    // Check if language is set. If default 'en' and created just now, maybe ask? 
    // Let's just show the welcome message in current language with a button to switch.

    await ctx.reply(
      t('welcome', lang, { id: user.id, credits: dbUser.credits }),
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('🇬🇧 English', 'set_lang_en'), Markup.button.callback('🇹🇳 Tounsi', 'set_lang_tn')]
        ])
      }
    );
  });

  // Language Handlers
  bot.action('set_lang_en', async (ctx) => {
    await db.setLanguage(ctx.from.id, 'en');
    await ctx.answerCbQuery('Language set to English 🇬🇧');
    await ctx.reply('Language set to English! Send a photo to start.');
  });

  bot.action('set_lang_tn', async (ctx) => {
    await db.setLanguage(ctx.from.id, 'tn');
    await ctx.answerCbQuery('Lougha tbaddlet l Tounsi 🇹🇳');
    await ctx.reply('Jawwek behi! Ab3ath taswira bech nebdeou.');
  });

  bot.command('myid', (ctx) => {
    ctx.reply(`Your Telegram ID is: \`${ctx.from.id}\``, { parse_mode: 'Markdown' });
  });

  bot.command('setcredits', async (ctx) => {
    const adminId = process.env.ADMIN_ID;
    if (String(ctx.from.id) !== String(adminId)) {
      const user = await db.getUser(ctx.from.id);
      return ctx.reply(t('admin_only', user?.language));
    }

    const args = ctx.message.text.split(' ');
    if (args.length !== 3) {
      return ctx.reply('Usage: /setcredits <user_id> <amount>');
    }

    const targetId = args[1];
    const amount = parseInt(args[2]);

    if (isNaN(amount)) return ctx.reply('Invalid amount.');

    try {
      await db.updateCredits(targetId, amount);
      const adminLang = (await db.getUser(ctx.from.id))?.language || 'en';
      ctx.reply(t('credits_updated', adminLang, { id: targetId, amount }));

      const targetUser = await db.getUser(targetId);
      if (targetUser) {
        bot.telegram.sendMessage(targetId, t('credits_received', targetUser.language, { amount }));
      }
    } catch (err) {
      ctx.reply('Failed to update credits. Check the ID.');
    }
  });

  bot.command('credits', async (ctx) => {
    const credits = await db.getCredits(ctx.from.id);
    const user = await db.getUser(ctx.from.id);
    ctx.reply(t('credits_remaining', user?.language, { credits }));
  });

  bot.command('stats', async (ctx) => {
    const adminId = process.env.ADMIN_ID;
    if (String(ctx.from.id) !== String(adminId)) return;

    const stats = await db.getStats();
    const user = await db.getUser(ctx.from.id);
    ctx.reply(
      t('stats', user?.language, { users: stats.total_users, gens: stats.total_generations }),
      { parse_mode: 'Markdown' }
    );
  });

  bot.command('stop', async (ctx) => {
    const userId = ctx.from.id;
    userState.delete(userId);
    const user = await db.getUser(userId);
    ctx.reply(t('stop_success', user?.language));
  });


  // User Commands
  bot.command('help', async (ctx) => {
    const user = await db.getUser(ctx.from.id);
    ctx.reply(t('help', user?.language), { parse_mode: 'Markdown' });
  });

  bot.command('profile', async (ctx) => {
    const user = await db.getUser(ctx.from.id);
    if (!user) return;
    ctx.reply(
      t('profile', user.language, { id: user.telegramId, credits: user.credits, gens: user.generationsCount }),
      { parse_mode: 'Markdown' }
    );
  });

  bot.command('lang', async (ctx) => {
    ctx.reply(
      'Choose your language / Khtar el lougha:',
      Markup.inlineKeyboard([
        [Markup.button.callback('🇬🇧 English', 'set_lang_en'), Markup.button.callback('🇹🇳 Tounsi', 'set_lang_tn')]
      ])
    );
  });

  // Admin Commands
  bot.command('gift', async (ctx) => {
    const adminId = process.env.ADMIN_ID;
    if (String(ctx.from.id) !== String(adminId)) return;

    const args = ctx.message.text.split(' ');
    if (args.length !== 3) return ctx.reply('Usage: /gift <user_id> <amount>');

    const targetId = args[1];
    const amount = parseInt(args[2]);
    if (isNaN(amount)) return ctx.reply('Invalid amount.');

    try {
      await db.incrementCredits(targetId, amount);
      const adminUser = await db.getUser(ctx.from.id);
      ctx.reply(t('gift_success', adminUser?.language, { id: targetId, amount }));

      const targetUser = await db.getUser(targetId);
      if (targetUser) {
        bot.telegram.sendMessage(targetId, t('gift_received', targetUser.language, { amount }));
      }
    } catch (err) {
      ctx.reply('Failed to gift credits.');
    }
  });

  bot.command('giftall', async (ctx) => {
    const adminId = process.env.ADMIN_ID;
    if (String(ctx.from.id) !== String(adminId)) return;

    const args = ctx.message.text.split(' ');
    if (args.length !== 2) return ctx.reply('Usage: /giftall <amount>');

    const amount = parseInt(args[1]);
    if (isNaN(amount)) return ctx.reply('Invalid amount.');

    const users = await db.getAllUsers();
    let count = 0;
    for (const user of users) {
      await db.incrementCredits(user.telegramId, amount);
      bot.telegram.sendMessage(user.telegramId, t('gift_received', user.language, { amount })).catch(() => { });
      count++;
    }
    ctx.reply(`✅ Gifted ${amount} credits to ${count} users.`);
  });

  bot.command('broadcast', async (ctx) => {
    const adminId = process.env.ADMIN_ID;
    if (String(ctx.from.id) !== String(adminId)) return;

    const message = ctx.message.text.split(' ').slice(1).join(' ');
    if (!message) return ctx.reply('Usage: /broadcast <message>');

    const users = await db.getAllUsers();
    let count = 0;
    for (const user of users) {
      bot.telegram.sendMessage(user.telegramId, `📢 **Announcement**\n\n${message}`, { parse_mode: 'Markdown' }).catch(() => { });
      count++;
    }
    const adminUser = await db.getUser(ctx.from.id);
    ctx.reply(t('broadcast_sent', adminUser?.language, { count }));
  });


  // 1. Photo Handler
  bot.on('photo', async (ctx) => {
    const userId = ctx.from.id;
    // Ensure user exists (get or create)
    const user = await db.createUser(userId, ctx.from.username);
    const lang = user?.language || 'en';


    if (user.credits <= 0) {
      return ctx.reply(t('insufficient_credits', lang));
    }

    const photo = ctx.message.photo.pop();
    const fileLink = await ctx.telegram.getFileLink(photo.file_id);

    userState.set(userId, {
      fileLink: fileLink.href,
      step: 'category'
    });

    ctx.reply(
      t('choose_category', lang),
      Markup.inlineKeyboard([
        [Markup.button.callback(t('buttons.clothes', lang), 'cat_clothes'), Markup.button.callback(t('buttons.shoes', lang), 'cat_shoes')]
      ])
    );
  });

  // 1.5 Category Handler
  bot.action(/cat_(.+)/, async (ctx) => {
    const category = ctx.match[1];
    const userId = ctx.from.id;
    const user = await db.getUser(userId);
    const lang = user?.language || 'en';

    const state = userState.get(userId);
    if (!state) return ctx.reply(t('session_expired', lang));

    state.category = category;
    state.step = 'gender';
    userState.set(userId, state);

    ctx.editMessageText(
      t('photo_received', lang).replace('product category', 'model gender').replace('chnowa el produit', 'el genre mta3 el mannequin'), // Reuse/Adapt message or just ask for gender
      Markup.inlineKeyboard([
        [Markup.button.callback(t('buttons.female', lang), 'gender_female'), Markup.button.callback(t('buttons.male', lang), 'gender_male')]
      ])
    );
  });


  // 2. Gender Handler
  bot.action(/gender_(.+)/, async (ctx) => {
    const gender = ctx.match[1];
    const userId = ctx.from.id;
    const user = await db.getUser(userId);
    const lang = user?.language || 'en';

    const state = userState.get(userId);
    if (!state) return ctx.reply(t('session_expired', lang));

    state.gender = gender;
    state.step = 'ethnicity';
    userState.set(userId, state);

    ctx.editMessageText(
      t('choose_ethnicity', lang),
      Markup.inlineKeyboard([
        [Markup.button.callback(t('buttons.tunisian', lang), 'eth_tunisian'), Markup.button.callback(t('buttons.european', lang), 'eth_caucasian')]
      ])
    );
  });

  // 3. Ethnicity Handler
  bot.action(/eth_(.+)/, async (ctx) => {
    const ethnicity = ctx.match[1];
    const userId = ctx.from.id;
    const user = await db.getUser(userId);
    const lang = user?.language || 'en';

    const state = userState.get(userId);
    if (!state) return ctx.reply(t('session_expired', lang));

    state.ethnicity = ethnicity;
    state.step = 'style';
    userState.set(userId, state);

    const buttons = PRESET_PROMPTS.map((p, i) => {
      const label = p.label[lang] || p.label.en;
      return Markup.button.callback(label, `style_${i}`);
    });
    const rows = chunk(buttons, 2);

    ctx.editMessageText(
      t('choose_style', lang),
      Markup.inlineKeyboard(rows)
    );

  });

  // 4. Style Handler
  bot.action(/style_(.+)/, async (ctx) => {
    const styleIndex = parseInt(ctx.match[1]);
    const userId = ctx.from.id;
    const user = await db.getUser(userId);
    const lang = user?.language || 'en';

    const state = userState.get(userId);
    if (!state) return ctx.reply(t('session_expired', lang));

    state.stylePrompt = PRESET_PROMPTS[styleIndex].prompt;
    state.styleLabel = PRESET_PROMPTS[styleIndex].label[lang] || PRESET_PROMPTS[styleIndex].label.en;
    state.step = 'pose';
    userState.set(userId, state);

    const poses = state.category === 'shoes' ? SHOE_POSE_PROMPTS : POSE_PROMPTS;
    const buttons = poses.map((p, i) => {
      const label = p.label[lang] || p.label.en;
      return Markup.button.callback(label, `pose_${i}`);
    });

    const rows = chunk(buttons, 2);

    ctx.editMessageText(
      t('choose_pose', lang),
      Markup.inlineKeyboard(rows)
    );

  });

  // 5. Pose Handler
  bot.action(/pose_(.+)/, async (ctx) => {
    const poseIndex = parseInt(ctx.match[1]);
    const userId = ctx.from.id;
    const user = await db.getUser(userId);
    const lang = user?.language || 'en';

    const state = userState.get(userId);
    if (!state) return ctx.reply(t('session_expired', lang));

    if (!state) return ctx.reply(t('session_expired', lang));

    const poses = state.category === 'shoes' ? SHOE_POSE_PROMPTS : POSE_PROMPTS;
    state.posePrompt = poses[poseIndex].prompt;
    state.step = 'backdrop';
    userState.set(userId, state);


    const buttons = BACKDROP_PROMPTS.map((p, i) => {
      const label = p.label[lang] || p.label.en;
      return Markup.button.callback(label, `bg_${i}`);
    });
    const rows = chunk(buttons, 2);

    ctx.editMessageText(
      t('choose_backdrop', lang),
      Markup.inlineKeyboard(rows)
    );

  });

  // 6. Backdrop Handler & Generation
  bot.action(/bg_(.+)/, async (ctx) => {
    const bgIndex = parseInt(ctx.match[1]);
    const userId = ctx.from.id;
    const user = await db.getUser(userId);
    const lang = user?.language || 'en';

    const state = userState.get(userId);
    if (!state) return ctx.reply(t('session_expired', lang));

    state.backdropPrompt = BACKDROP_PROMPTS[bgIndex].prompt;

    const result = await db.deductCredit(userId);
    if (!result.success) return ctx.reply(t('insufficient_credits', lang));

    ctx.editMessageText(t('generating', lang));
    await ctx.sendChatAction('typing');

    try {
      const response = await axios({ url: state.fileLink, responseType: 'stream' });
      const tempPath = path.join(__dirname, '..', 'uploads', `temp_${userId}_${Date.now()}.jpg`);
      const writer = fs.createWriteStream(tempPath);
      response.data.pipe(writer);
      await new Promise((resolve, reject) => { writer.on('finish', resolve); writer.on('error', reject); });

      await ctx.sendChatAction('upload_photo');

      // Extract Color
      const palette = await extractColorPalette(tempPath);
      const dominantColor = palette[0]?.hex || '#FFFFFF';
      const colorName = getColorName(dominantColor);
      console.log(`Detected Color: ${colorName} (${dominantColor})`);

      const ethnicityMap = { 'tunisian': 'Tunisian ethnicity, North African features', 'caucasian': 'Caucasian ethnicity' };
      const ethDesc = ethnicityMap[state.ethnicity] ? `with ${ethnicityMap[state.ethnicity]}` : '';
      const genderDesc = state.gender || 'female';

      let categoryPrompt = '';
      if (state.category === 'shoes') {
        categoryPrompt = 'Focus on the footwear. The uploaded image is a shoe. Ensure the model is wearing these exact shoes. Low angle or appropriate camera angle to showcase the shoes.';
      }

      const fullPrompt = [
        `CRITICAL: The garment/product is ${colorName}. Match this color exactly.`,
        categoryPrompt,
        state.stylePrompt,
        state.posePrompt,
        state.backdropPrompt,
        `Use a ${genderDesc} model ${ethDesc}.`,
        `Photorealistic, high resolution, skin-safe lighting.`,
        `Color lock: preserve exact garment color, no hue shift.`,
        `Modesty Lock: Model must wear neutral trousers or skirt. No partial nudity.`
      ].join(' ');



      const options = { modelPersona: { gender: state.gender, ethnicity: state.ethnicity } };

      const genResult = await geminiService.generateImage(tempPath, fullPrompt, options);

      if (genResult.imageUrl) {
        const credits = await db.getCredits(userId);
        await ctx.replyWithPhoto(genResult.imageUrl, {
          caption: t('result_caption', lang, { style: state.styleLabel, gender: state.gender, ethnicity: state.ethnicity, credits }),
          parse_mode: 'Markdown'
        });

      } else {
        throw new Error('No image URL returned');
      }
      fs.unlinkSync(tempPath);
      userState.delete(userId);

    } catch (error) {
      console.error('Bot generation error:', error);
      ctx.reply(t('regen_failed', lang));
      await db.refundCredit(userId);
    }
  });



}

// Startup Cleanup
const cleanupUploads = () => {
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (fs.existsSync(uploadsDir)) {
    fs.readdirSync(uploadsDir).forEach(file => {
      if (file.startsWith('temp_')) {
        fs.unlinkSync(path.join(uploadsDir, file));
      }
    });
    console.log('🧹 Cleaned up temp files.');
  }
};

module.exports = {
  launch: () => {
    if (bot) {
      cleanupUploads();
      bot.launch();
      console.log('Telegram bot started');
      process.once('SIGINT', () => bot.stop('SIGINT'));
      process.once('SIGTERM', () => bot.stop('SIGTERM'));
    }
  }
};
