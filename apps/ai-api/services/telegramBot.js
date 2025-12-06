const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const db = require('../db/database');
const geminiService = require('./geminiService');
const { PRESET_PROMPTS, POSE_PROMPTS, SHOE_POSE_PROMPTS, MODELS, BACKGROUNDS } = require('../config/botConfig');

const locales = require('../config/locales');
const { extractColorPalette } = require('../utils/serverColorExtraction');
const { getColorName } = require('../utils/colorNaming');

const HERO_BANNER_PATH = path.join(__dirname, '..', 'assets', 'banner', 'banner.png');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
  console.warn('TELEGRAM_BOT_TOKEN is not set. Bot will not start.');
}

const bot = BOT_TOKEN ? new Telegraf(BOT_TOKEN) : null;

// User state to track flow
const userState = new Map();
const recentResults = new Map(); // store last generated image context per user
const activeVideoJobs = new Set(); // prevent duplicate video jobs per user

const isAdmin = (fromId) => {
  const envAdmins = process.env.ADMIN_IDS || process.env.ADMIN_ID || '';
  const ids = envAdmins.split(',').map((id) => id.trim()).filter(Boolean);
  return ids.some((id) => String(id) === String(fromId));
};

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

const describeEthnicity = (ethnicityKey) => {
  const map = {
    'tunisian': 'Tunisian / North African features',
    'caucasian': 'Caucasian features',
  };
  return map[ethnicityKey] || ethnicityKey || '';
};

const buildVideoPrompt = (context) => {
  const isShoes = context.category === 'shoes';
  const personaParts = [];

  if (context.gender) {
    personaParts.push(`${context.gender} model`);
  }
  if (context.ethnicity) {
    personaParts.push(describeEthnicity(context.ethnicity));
  }

  const motion = isShoes
    ? 'Showcase the shoes with a smooth 360 orbit around the feet. Start with a hero shot then rotate to front, side, and back angles. Include quick close-ups of the sole, heel, and side profile.'
    : 'The model performs a slow 360-degree turn-in-place showing front, side, and back of the outfit. Camera gently circles to keep the model centered with clean studio framing.';

  const colorLock = context.colorName
    ? `Lock garment color to ${context.colorName}; no hue shifts or saturation drift.`
    : 'Keep garment colors perfectly accurate; no hue shifts.';

  const cues = [
    'Create a photorealistic 8-second 16:9 fashion video at 1080p using Veo 3.1 Fast.',
    motion,
    'Camera movement is cinematic and stable, no flicker or glitches. Natural skin motion, fabric physics, soft studio lighting.',
    colorLock,
    personaParts.length ? `Use a ${personaParts.join(' with ')}.` : '',
    context.styleLabel ? `Style reference: ${context.styleLabel}.` : '',
    context.posePrompt ? `Pose direction: ${context.posePrompt}` : '',
    context.backdropPrompt ? `Backdrop: ${context.backdropPrompt}` : '',
    'High detail, commercial quality, realistic shading and texture.'
  ];

  return cues.filter(Boolean).join(' ');
};

if (bot) {
  bot.start(async (ctx) => {
    const user = ctx.from;
    let dbUser = await db.createUser(user.id, user.username);

    if (dbUser.isBanned) return ctx.reply(t('banned_msg', dbUser.language || 'en'));


    // If language not set (or default 'en' but we want to force choice first time? No, let's just offer choice)
    // Actually, let's show language picker if it's a new user or they explicitly ask

    // Pro Onboarding Flow
    const lang = dbUser.language || 'en';

    // Send Hero Image + Menu
    const heroImage = fs.existsSync(HERO_BANNER_PATH)
      ? { source: HERO_BANNER_PATH }
      : 'https://placehold.co/1200x600.png?text=Clothes2Model+AI+Tunisia';

    await ctx.replyWithPhoto(heroImage, {
      caption: t('welcome_hero_caption', lang),
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback(t('buttons.start_creating', lang), 'start_creating')],
        [Markup.button.callback(t('buttons.how_it_works', lang), 'tutorial'), Markup.button.callback(t('buttons.pricing', lang), 'pricing_cb')]
      ])
    });
  });

  // Action: Start Creating
  bot.action('start_creating', async (ctx) => {
    const userId = ctx.from.id;
    const user = await db.getUser(userId);
    const lang = user?.language || 'en';

    // Check for email
    if (!user.email) {
      userState.set(userId, { step: 'waiting_for_email' });
      return ctx.reply(t('ask_email_pro', lang));
    }

    // If email exists, show Language Selector (or go to "Send Photo" instruction)
    // Plan said: "Show Language Selector"
    await ctx.reply(
      'Choose your language / Khtar el lougha:',
      Markup.inlineKeyboard([
        [Markup.button.callback('🇬🇧 English', 'set_lang_en'), Markup.button.callback('🇹🇳 Tounsi', 'set_lang_tn')]
      ])
    );
  });

  // Action: Tutorial
  bot.action('tutorial', async (ctx) => {
    const userId = ctx.from.id;
    const user = await db.getUser(userId);
    const lang = user?.language || 'en';
    await ctx.reply(t('tutorial_msg', lang), { parse_mode: 'Markdown' });
  });

  // Action: Pricing
  bot.action('pricing_cb', async (ctx) => {
    const userId = ctx.from.id;
    const user = await db.getUser(userId);
    const lang = user?.language || 'en';
    await ctx.reply(t('pricing_msg', lang), { parse_mode: 'Markdown' });
  });

  // Text Handler (for Email)
  bot.on('text', async (ctx, next) => {
    const userId = ctx.from.id;
    const state = userState.get(userId);

    // Ignore commands
    if (ctx.message.text.startsWith('/')) return next();

    if (state && state.step === 'waiting_for_email') {
      const email = ctx.message.text.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const user = await db.getUser(userId);
      const lang = user?.language || 'en';

      if (!emailRegex.test(email)) {
        return ctx.reply(t('invalid_email', lang));
      }

      await db.setEmail(userId, email);
      userState.delete(userId);
      await ctx.reply(t('email_saved', lang));

      // Show welcome menu after saving email
      return ctx.reply(
        t('welcome', lang, { id: userId, credits: user.credits }),
        {
          parse_mode: 'Markdown',
          ...Markup.inlineKeyboard([
            [Markup.button.callback('🇬🇧 English', 'set_lang_en'), Markup.button.callback('🇹🇳 Tounsi', 'set_lang_tn')]
          ])
        }
      );
    }

    // Not an email flow: continue to other middleware/commands
    return next();
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
    const adminOk = isAdmin(ctx.from.id);
    console.log('[setcredits] from', ctx.from.id, 'isAdmin:', adminOk, 'text:', ctx.message?.text);

    if (!adminOk) {
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
      const updated = await db.updateCredits(targetId, amount);
      const adminLang = (await db.getUser(ctx.from.id))?.language || 'en';
      ctx.reply(t('credits_updated', adminLang, { id: targetId, amount }));

      const targetUser = updated || await db.getUser(targetId);
      if (targetUser) {
        bot.telegram.sendMessage(targetId, t('credits_received', targetUser.language, { amount }));
      } else {
        ctx.reply('User not found. Ask them to /start first.');
      }
    } catch (err) {
      console.error('setcredits error', err);
      ctx.reply('Failed to update credits. Check the ID.');
    }
  });

  bot.command('credits', async (ctx) => {
    const credits = await db.getCredits(ctx.from.id);
    const user = await db.getUser(ctx.from.id);
    ctx.reply(t('credits_remaining', user?.language, { credits }));
  });

  bot.command('stats', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return;

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
    recentResults.delete(userId);
    activeVideoJobs.delete(userId);
    const user = await db.getUser(userId);
    ctx.reply(t('stop_success', user?.language));
  });

  bot.command('support', async (ctx) => {
    const user = await db.getUser(ctx.from.id);
    ctx.reply(t('support_msg', user?.language), { parse_mode: 'Markdown' });
  });

  bot.command('pricing', async (ctx) => {
    const user = await db.getUser(ctx.from.id);
    ctx.reply(t('pricing_msg', user?.language), { parse_mode: 'Markdown' });
  });

  bot.command('terms', async (ctx) => {
    const user = await db.getUser(ctx.from.id);
    ctx.reply(t('terms_msg', user?.language), { parse_mode: 'Markdown' });
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
    if (!isAdmin(ctx.from.id)) return;

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
    if (!isAdmin(ctx.from.id)) return;

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
    if (!isAdmin(ctx.from.id)) return;

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

  bot.command('ban', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return;

    const args = ctx.message.text.split(' ');
    if (args.length !== 2) return ctx.reply('Usage: /ban <user_id>');
    const targetId = args[1];

    await db.banUser(targetId);
    const adminUser = await db.getUser(ctx.from.id);
    ctx.reply(t('ban_success', adminUser?.language, { id: targetId }));
  });

  bot.command('unban', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return;

    const args = ctx.message.text.split(' ');
    if (args.length !== 2) return ctx.reply('Usage: /unban <user_id>');
    const targetId = args[1];

    await db.unbanUser(targetId);
    const adminUser = await db.getUser(ctx.from.id);
    ctx.reply(t('unban_success', adminUser?.language, { id: targetId }));
  });

  bot.command('userinfo', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return;

    const args = ctx.message.text.split(' ');
    if (args.length !== 2) return ctx.reply('Usage: /userinfo <user_id>');
    const targetId = args[1];

    const targetUser = await db.getUser(targetId);
    if (!targetUser) return ctx.reply('User not found.');

    const adminUser = await db.getUser(ctx.from.id);
    ctx.reply(
      t('user_info', adminUser?.language, {
        id: targetUser.telegramId,
        username: targetUser.username || 'N/A',
        credits: targetUser.credits,
        gens: targetUser.generationsCount,
        banned: targetUser.isBanned ? 'Yes' : 'No'
      }),
      { parse_mode: 'Markdown' }
    );
  });



  // 1. Photo Handler
  bot.on('photo', async (ctx) => {
    const userId = ctx.from.id;
    // Ensure user exists (get or create)
    const user = await db.createUser(userId, ctx.from.username);
    const lang = user?.language || 'en';

    if (user.isBanned) return ctx.reply(t('banned_msg', lang));



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
      t('photo_received', lang).replace('product category', 'model gender').replace('chnowa el produit', 'el genre mta3 el mannequin'),
      Markup.inlineKeyboard([
        [Markup.button.callback(t('buttons.female', lang), 'gender_female'), Markup.button.callback(t('buttons.male', lang), 'gender_male')]
      ])
    );
  });

  // 1.6 Gender Handler
  bot.action(/gender_(.+)/, async (ctx) => {
    const gender = ctx.match[1];
    const userId = ctx.from.id;
    const user = await db.getUser(userId);
    const lang = user?.language || 'en';

    const state = userState.get(userId);
    if (!state) return ctx.reply(t('session_expired', lang));

    state.gender = gender;
    state.modelIndex = 0; // Initialize model carousel
    userState.set(userId, state);

    await sendModelSelection(ctx, userId, 0);
  });

  // Helper: Send Model Carousel
  const sendModelSelection = async (ctx, userId, index) => {
    const user = await db.getUser(userId);
    const lang = user?.language || 'en';
    const state = userState.get(userId);

    // Filter models by gender if needed, or just show all? 
    // Let's filter by gender if user selected one? 
    // Wait, we removed gender selection step. Let's filter by implied gender or show all?
    // The user said "choose model photo from the list".
    // Let's show ALL models but maybe sort them? 
    // Actually, let's just show all MODELS from config.

    const models = MODELS.filter(m => m.gender === state.gender);
    const total = models.length;
    // Wrap index
    const i = (index + total) % total;
    state.modelIndex = i;
    userState.set(userId, state);

    const model = models[i];
    const name = model.name[lang] || model.name.en;
    const style = model.style[lang] || model.style.en;

    const caption = `👤 **${name}**\n🎭 ${style}\n\n${model.description}`;

    const buttons = [
      [
        Markup.button.callback('⬅️', 'model_prev'),
        Markup.button.callback(`✅ Select ${name}`, `model_select_${model.id}`),
        Markup.button.callback('➡️', 'model_next')
      ]
    ];

    // If editing existing message (from Prev/Next) vs sending new (from Category)
    // We can try editMessageMedia if it was a photo, but previous was text (Category).
    // So we must delete previous or send new. 
    // Simplest: Delete previous text if possible, send new photo.
    // Or just send photo.

    try {
      if (ctx.callbackQuery) {
        // If we are navigating (prev/next), we are editing the media
        // But if we came from Category (text), we can't edit text into photo easily without error if types differ too much in some clients, 
        // but editMessageMedia works for converting animation/photo. 
        // However, Category was text. 
        // So:
        // If coming from Category (text), delete text and send photo.
        // If coming from Model Prev/Next (photo), edit media.

        const media = (model.path && fs.existsSync(model.path))
          ? { source: model.path }
          : model.previewUrl;

        if (ctx.callbackQuery.data.startsWith('cat_')) {
          await ctx.deleteMessage().catch(() => { });
          await ctx.replyWithPhoto(media, {
            caption,
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard(buttons)
          });
        } else {
          await ctx.editMessageMedia({
            type: 'photo',
            media: media,
            caption,
            parse_mode: 'Markdown'
          }, Markup.inlineKeyboard(buttons));
        }
      }
    } catch (err) {
      // Fallback if edit fails
      console.error('Carousel error', err);
      await ctx.replyWithPhoto(model.previewUrl, {
        caption,
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard(buttons)
      });
    }
  };

  // Model Navigation Handlers
  bot.action('model_prev', (ctx) => {
    const userId = ctx.from.id;
    const state = userState.get(userId);
    if (!state) return ctx.answerCbQuery('Session expired');
    sendModelSelection(ctx, userId, state.modelIndex - 1);
  });

  bot.action('model_next', (ctx) => {
    const userId = ctx.from.id;
    const state = userState.get(userId);
    if (!state) return ctx.answerCbQuery('Session expired');
    sendModelSelection(ctx, userId, state.modelIndex + 1);
  });

  // Model Selection Handler
  bot.action(/model_select_(.+)/, async (ctx) => {
    const modelId = ctx.match[1];
    const userId = ctx.from.id;
    const state = userState.get(userId);
    if (!state) return ctx.reply('Session expired');

    const selectedModel = MODELS.find(m => m.id === modelId);
    state.selectedModel = selectedModel;
    state.bgIndex = 0; // Init bg carousel
    userState.set(userId, state);

    await sendBackgroundSelection(ctx, userId, 0);
  });


  // Helper: Send Background Carousel
  const sendBackgroundSelection = async (ctx, userId, index) => {
    const user = await db.getUser(userId);
    const lang = user?.language || 'en';
    const state = userState.get(userId);

    const backgrounds = BACKGROUNDS;
    const total = backgrounds.length;
    const i = (index + total) % total;
    state.bgIndex = i;
    userState.set(userId, state);

    const bg = backgrounds[i];
    const name = bg.name[lang] || bg.name.en;

    const caption = `🏙️ **${name}**`;
    const media = (bg.path && fs.existsSync(bg.path)) ? { source: bg.path } : bg.previewUrl;

    const buttons = [
      [
        Markup.button.callback('⬅️', 'bg_prev'),
        Markup.button.callback(`✅ Select ${name}`, `bg_select_${bg.id}`),
        Markup.button.callback('➡️', 'bg_next')
      ]
    ];

    try {
      // We are coming from Model Selection (Photo) or BG Prev/Next (Photo).
      // So we can always use editMessageMedia.
      await ctx.editMessageMedia({
        type: 'photo',
        media: media,
        caption,
        parse_mode: 'Markdown'
      }, Markup.inlineKeyboard(buttons));
    } catch (err) {
      console.error('BG Carousel error', err);
      await ctx.replyWithPhoto(media, {
        caption,
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard(buttons)
      });
    }
  };

  // Background Navigation
  bot.action('bg_prev', (ctx) => {
    const userId = ctx.from.id;
    const state = userState.get(userId);
    if (!state) return ctx.answerCbQuery('Session expired');
    sendBackgroundSelection(ctx, userId, state.bgIndex - 1);
  });

  bot.action('bg_next', (ctx) => {
    const userId = ctx.from.id;
    const state = userState.get(userId);
    if (!state) return ctx.answerCbQuery('Session expired');
    sendBackgroundSelection(ctx, userId, state.bgIndex + 1);
  });

  // Background Selection & Review
  bot.action(/bg_select_(.+)/, async (ctx) => {
    const bgId = ctx.match[1];
    const userId = ctx.from.id;
    const state = userState.get(userId);
    if (!state) return ctx.reply('Session expired');

    const selectedBg = BACKGROUNDS.find(b => b.id === bgId);
    state.selectedBackground = selectedBg;
    userState.set(userId, state);

    // Send Review
    const user = await db.getUser(userId);
    const lang = user?.language || 'en';

    const modelName = state.selectedModel.name[lang] || state.selectedModel.name.en;
    const bgName = state.selectedBackground.name[lang] || state.selectedBackground.name.en;

    const reviewText = `📝 **Review Your Order**\n\n` +
      `👤 **Model:** ${modelName}\n` +
      `🏙️ **Background:** ${bgName}\n` +
      `👕 **Category:** ${state.category}\n\n` +
      `Ready to generate?`;

    // Delete the background carousel message to clean up, or just reply?
    // Let's reply with text.
    await ctx.deleteMessage().catch(() => { });
    await ctx.reply(reviewText, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('✨ Generate Photo', 'generate_photo')],
        [Markup.button.callback('🔄 Start Over', 'start_over')]
      ])
    });
  });

  bot.action('start_over', async (ctx) => {
    ctx.deleteMessage().catch(() => { });
    ctx.reply('Send a new photo to start over.');
    userState.delete(ctx.from.id);
  });

  // Generate Handler
  bot.action('generate_photo', async (ctx) => {
    const userId = ctx.from.id;
    const state = userState.get(userId);
    const user = await db.getUser(userId);
    const lang = user?.language || 'en';

    if (!state) return ctx.reply(t('session_expired', lang));

    const result = await db.deductCredit(userId);
    if (!result.success) return ctx.reply(t('insufficient_credits', lang));

    // Animated Progress Bar
    let progressMsg = t('generating', lang);
    const progressSteps = [
      "🎨 **BrandModel** is analyzing your cloth...",
      "👗 Fitting the model...",
      "💡 Adjusting studio lighting...",
      "✨ Rendering final details..."
    ];
    let stepIndex = 0;

    // Send initial message
    await ctx.editMessageText(progressSteps[0], { parse_mode: 'Markdown' });

    const progressInterval = setInterval(async () => {
      stepIndex = (stepIndex + 1) % progressSteps.length;
      try {
        await ctx.editMessageText(progressSteps[stepIndex], { parse_mode: 'Markdown' });
      } catch (e) {
        // Ignore edit errors (e.g. if message didn't change or was deleted)
      }
    }, 3000);

    await ctx.sendChatAction('typing');

    try {
      const response = await axios({ url: state.fileLink, responseType: 'stream' });
      const tempPath = path.join(__dirname, '..', 'uploads', `temp_${userId}_${Date.now()}.jpg`);
      const writer = fs.createWriteStream(tempPath);
      response.data.pipe(writer);
      await new Promise((resolve, reject) => { writer.on('finish', resolve); writer.on('error', reject); });

      await ctx.sendChatAction('upload_photo');

      // Extract Color with enhanced analysis
      const { generateRequestId } = require('../utils/requestId');
      const logger = require('../utils/logger');
      const PromptBuilder = require('../utils/promptBuilder');
      const { generatePaletteMessage, getConfidenceMessage } = require('../utils/colorEmoji');

      const requestId = generateRequestId(userId, 'generate');
      const startTime = Date.now();
      const log = logger.withContext({ requestId, userId });

      log.info('Generation started', { category: state.category, model: state.selectedModel.id });

      const palette = await extractColorPalette(tempPath);
      const colorConfidence = PromptBuilder.assessColorConfidence(palette);

      // Store palette and confidence in state
      state.colorPalette = palette;
      state.colorConfidence = colorConfidence;

      // Show palette to user
      const paletteMsg = generatePaletteMessage(palette, lang);
      const confidenceMsg = getConfidenceMessage(colorConfidence, palette, lang);
      await ctx.reply(`${paletteMsg}\n\n${confidenceMsg}`, { parse_mode: 'Markdown' });

      log.info('Color analysis completed', {
        dominantColor: palette[0]?.hex,
        colorName: palette[0]?.name,
        confidence: colorConfidence
      });

      // Build sophisticated prompt using PromptBuilder
      const promptBuilder = new PromptBuilder({
        category: state.category,
        colorPalette: state.colorPalette,
        modelPersona: {
          gender: state.selectedModel.gender,
          ethnicity: state.selectedModel.ethnicity,
          description: state.selectedModel.description
        },
        backdrop: state.selectedBackground,
        colorConfidence: state.colorConfidence
      });

      const fullPrompt = promptBuilder.build();

      log.info('Prompt built', { promptTokens: promptBuilder.getTokenEstimate() });

      const options = {
        modelPersona: { gender: state.selectedModel.gender, ethnicity: state.selectedModel.ethnicity },
        modelReferencePath: state.selectedModel.path // Pass the local model image path
      };

      const genResult = await geminiService.generateImage(tempPath, fullPrompt, options);

      // Stop animation
      clearInterval(progressInterval);

      if (genResult.imageUrl) {
        const duration = Date.now() - startTime;
        log.info('Generation completed successfully', {
          duration,
          imageUrl: genResult.imageUrl
        });

        const credits = await db.getCredits(userId);
        const referenceUrl = genResult.downloadUrl || genResult.imageUrl;

        recentResults.set(userId, {
          referenceUrl,
          imageUrl: genResult.imageUrl,
          gender: state.selectedModel.gender,
          ethnicity: state.selectedModel.ethnicity,
          category: state.category,
          styleLabel: 'Custom',
          posePrompt: 'Natural',
          backdropPrompt: state.selectedBackground.prompt,
          colorName: palette[0]?.name || 'Unknown',
          colorPalette: state.colorPalette,
        });

        await ctx.deleteMessage().catch(() => { }); // Delete progress message
        await ctx.replyWithPhoto(genResult.imageUrl, {
          caption: t('result_caption', lang, { style: 'Custom', gender: state.selectedModel.gender, ethnicity: 'Tunisian', credits }),
          parse_mode: 'Markdown'
        });

        await ctx.reply(
          t('video_offer', lang),
          Markup.inlineKeyboard([
            [Markup.button.callback(t('buttons.animate', lang), 'animate_video')]
          ])
        );

      } else {
        throw new Error('No image URL returned');
      }
      fs.unlinkSync(tempPath);
      userState.delete(userId);

    } catch (error) {
      clearInterval(progressInterval); // Stop animation on error

      // Use centralized error handler
      const { handleGenerationError } = require('../utils/errorHandler');
      await handleGenerationError(error, ctx, userId, requestId, lang);

      // Clean up
      try {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      } catch (cleanupError) {
        logger.error('Failed to cleanup temp file', { requestId, userId, cleanupError: cleanupError.message });
      }
    }
  });

  bot.action('animate_video', async (ctx) => {
    const userId = ctx.from.id;
    const user = await db.getUser(userId);
    const lang = user?.language || 'en';

    await ctx.answerCbQuery();

    if (user?.isBanned) {
      return ctx.reply(t('banned_msg', lang));
    }

    const lastResult = recentResults.get(userId);

    if (!lastResult || !lastResult.referenceUrl) {
      return ctx.reply(t('video_no_recent', lang));
    }

    if (activeVideoJobs.has(userId)) {
      return ctx.reply(t('video_in_progress', lang));
    }

    const creditResult = await db.deductCredit(userId);
    if (!creditResult.success) {
      return ctx.reply(t('insufficient_credits', lang));
    }

    activeVideoJobs.add(userId);

    try {
      await ctx.reply(t('video_generating', lang));
      await ctx.sendChatAction('record_video');

      const prompt = buildVideoPrompt(lastResult);
      const videoResult = await geminiService.generateVideoFromImage(lastResult.referenceUrl, prompt);

      if (!videoResult?.videoUrl) {
        throw new Error('No video URL returned');
      }

      await ctx.sendChatAction('upload_video');
      await ctx.replyWithVideo({ url: videoResult.videoUrl }, {
        caption: t('video_ready', lang),
      });
    } catch (err) {
      console.error('Video generation error:', err);
      await db.refundCredit(userId);
      if (err?.message?.toLowerCase().includes('premium plan')) {
        ctx.reply(t('video_premium_required', lang));
      } else {
        ctx.reply(t('video_failed', lang));
      }
    } finally {
      activeVideoJobs.delete(userId);
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
