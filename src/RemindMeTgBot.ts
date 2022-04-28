import { MessageInfo } from "node-telegram-bot-api";
import CronNodeWrapper from "./CronNodeWrapper";
import RemindmeParser, {
    RemindmeTask,
    RemindmeCommand,
} from "./RemindmeParser";
import TelegramBotWrapper from "./TelegramBotWrapper";

class RemindMeTgBot {
    constructor(token: string) {
        this._tgBot = new TelegramBotWrapper(token);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this._tgBot.onText(/^\/remindme (.+)/, this._onTextCallback);
    }

    private _tgBot: TelegramBotWrapper;

    private _remindmeTask: RemindmeTask[] = [];

    public get remindmeTask(): RemindmeTask[] {
        return this._remindmeTask;
    }

    private _onTextCallback: (msg: MessageInfo, match: Array<unknown>) => void =
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (msg, _match) => {
            const res: RemindmeTask = RemindmeParser.tryParse(msg);

            if (!res.canParse) {
                this.sendHelpMessage(res.chatId);
                return;
            }

            switch (res.parse?.command) {
                case RemindmeCommand.Add:
                    this.processAddReminder(res);
                    break;
            }
        };

    private sendHelpMessage(chatId: number): void {
        const message =
            'Ouh! Sorry, I\'m having trouble to understand the instruction. Type "/remindme HELP" for usage';

        this._tgBot.sendMessage(chatId, message);
    }

    private processAddReminder(reminder: RemindmeTask): void {
        const cron = new CronNodeWrapper();
        cron.schedule(reminder.parse!.cronExpression, () => {
            this._tgBot.sendMessage(reminder.chatId, reminder.parse!.note);
        });
        cron.start();

        reminder.cron = cron;

        this._remindmeTask.push(reminder);

        this._tgBot.sendMessage(reminder.chatId, reminder.parse!.displayText);
    }
}

export default RemindMeTgBot;
