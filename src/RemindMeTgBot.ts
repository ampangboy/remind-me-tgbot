import TelegramBotWrapper from "./TelegramBotWrapper";

class RemindMeTgBot {
    constructor(token: string) {
        this._tgBot = new TelegramBotWrapper(token);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this._tgBot.onText("/remindme", (_msg, _match) => {
            //empty
        });
    }

    private _tgBot: TelegramBotWrapper;
}

export default RemindMeTgBot;
