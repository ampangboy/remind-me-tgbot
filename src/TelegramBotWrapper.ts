import TelegramBot, { MessageInfo } from "node-telegram-bot-api";

class TelegramBotWrapper {
    constructor(token: string) {
        this._bot = new TelegramBot(token, { polling: true });
    }

    private _bot: TelegramBot;

    public onText(
        regexp: RegExp,
        callback: (msg: MessageInfo, match: Array<unknown>) => void,
    ): void {
        this._bot.onText(regexp, callback);
    }

    public sendMessage(chatId: number, message: string): void {
        this._bot.sendMessage(chatId, message);
    }

    public onChannelText(
        regexp: RegExp,
        callback: (msg: MessageInfo, match: Array<unknown>) => void,
    ): void {
        this._bot.on("channel_post", m => {
            const match = regexp.exec(m.text);

            if (match !== null) {
                callback(m, match);
            }
        });
    }
}

export default TelegramBotWrapper;
