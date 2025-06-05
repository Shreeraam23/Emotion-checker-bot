const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot('7575975304:AAHRIv7SsHn9dXBr5V3jb8NQ53Y-euYGodg', { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "👋 Welcome to EmoCheck! Click the button below to open the emotion analyzer:", {
    reply_markup: {
      keyboard: [
        [
          {
            text: "🧠 Open EmoCheck",
            web_app: {
              url: "https://emotion-checker-bot.vercel.app/"
            }
          }
        ]
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    }
  });
});
