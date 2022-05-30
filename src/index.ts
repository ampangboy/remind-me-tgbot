import RemindMeTgBot from "./RemindMeTgBot";
import "dotenv/config";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const bot = new RemindMeTgBot(process.env.BOT_API);
