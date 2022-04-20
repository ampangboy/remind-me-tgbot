import TelegramBot from "node-telegram-bot-api";

class TelegramBotWrapper {
    constructor(token: string) {
        this._bot = new TelegramBot(token, { pooling: true });
    }

    private _bot: TelegramBot;

    public onText(
        regexp: string,
        // eslint-disable-next-line @typescript-eslint/ban-types
        callback: (msg: Object, match: Array<string>) => void,
    ): void {
        this._bot.onText(regexp, callback);
    }
}

export default TelegramBotWrapper;
