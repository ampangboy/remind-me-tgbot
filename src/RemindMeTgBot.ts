import { MessageInfo } from "node-telegram-bot-api";
import ReminderParser, { Reminder } from "./ReminderParser";
import TelegramBotWrapper from "./TelegramBotWrapper";

class RemindMeTgBot {
    constructor(token: string) {
        this._tgBot = new TelegramBotWrapper(token);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this._tgBot.onText(/^\/remindme (.+)/, this._onTextCallback);
    }

    private _tgBot: TelegramBotWrapper;

    private _reminderQueue: string[] = [];

    get reminderQueue(): string[] {
        return this._reminderQueue;
    }

    private _onTextCallback: (msg: MessageInfo, match: Array<unknown>) => void =
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (msg, _match) => {
            const res: Reminder = ReminderParser.tryParse(msg.text);

            if (res.canParse) {
                this._reminderQueue.push(msg.text);
            }
        };
}

export default RemindMeTgBot;
