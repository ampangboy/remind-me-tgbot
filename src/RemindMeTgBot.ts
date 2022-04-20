import ReminderParser from "./ReminderParser";
import TelegramBotWrapper from "./TelegramBotWrapper";

class RemindMeTgBot {
    constructor(token: string) {
        this._tgBot = new TelegramBotWrapper(token);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this._tgBot.onText(/^\/remindme (.+)/, (msg, _match) => {
            this._reminderQueue.push(msg.text);
            ReminderParser.parse(msg.text);
        });
    }

    private _tgBot: TelegramBotWrapper;

    private _reminderQueue: string[] = [];

    get reminderQueue(): string[] {
        return this._reminderQueue;
    }
}

export default RemindMeTgBot;
