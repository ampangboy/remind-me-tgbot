const TelegramBot = require("node-telegram-bot-api");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const bot = new TelegramBot(
    "5220539329:AAHgSTi11aIVLC1Z9gpBgTUJxpxPCWZlDNY",
    (option = { polling: true }),
);

bot.on("channel_post", m => {
    console.log(m);
});
