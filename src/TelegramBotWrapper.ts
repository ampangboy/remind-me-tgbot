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
}

export default TelegramBotWrapper;
