import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.BOT_TOKEN, { webHook: { port: false } });

// Set your webhook to this Vercel endpoint URL
bot.setWebHook(`https://your-vercel-project.vercel.app/api/webhook`);

export default async function handler(req, res) {
  if (req.method === "POST") {
    bot.processUpdate(req.body);
    return res.status(200).send("OK");
  } else {
    return res.status(200).send("Telegram Bot Webhook is running");
  }
}

// Bot logic here
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Welcome to EmoCheck", {
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
      resize_keyboard: true
    }
  });
});
