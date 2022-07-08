import { MessageInfo } from "node-telegram-bot-api";
import path from "path";
import CronNodeWrapper from "./CronNodeWrapper";
import FileAccessor from "./FileAccessor";
import { failParseText } from "./infoText";
import RemindmeParser, {
    RemindmeTask,
    RemindmeCommand,
} from "./RemindmeParser";
import TelegramBotWrapper from "./TelegramBotWrapper";

class RemindMeTgBot {
    constructor(token: string) {
        this._tgBot = new TelegramBotWrapper(token);

        this._tgBot.onText(/^\/remindme (.+)/, this._onTextCallback);
        this._tgBot.onChannelText(/^\/remindme (.+)/, this._onTextCallback);
        this._file = new FileAccessor(path.join(__dirname, "./tasks.txt"));
    }

    private _file: FileAccessor;

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
                this.sendFailParseMessage(res.chatId);
                return;
            }

            switch (res.parse?.command) {
                case RemindmeCommand.Add:
                    this.processAddReminder(res);
                    break;
                case RemindmeCommand.Delete:
                    this.processDeleteReminder(res);
                    break;
                case RemindmeCommand.Help:
                    this.processHelp(res);
                    break;
            }
        };

    private sendFailParseMessage(chatId: number): void {
        this._tgBot.sendMessage(chatId, failParseText);
    }

    private processAddReminder(reminder: RemindmeTask): void {
        const cron = new CronNodeWrapper();
        cron.schedule(reminder.parse!.cronExpression!, () => {
            this._tgBot.sendMessage(reminder.chatId, reminder.parse!.note!);
        });
        reminder.cron = cron;

        this._remindmeTask.push(reminder);
        this._remindmeTask[this._remindmeTask.length - 1].cron?.start();

        this._tgBot.sendMessage(reminder.chatId, reminder.parse!.displayText);
    }

    private processDeleteReminder(task: RemindmeTask): void {
        const filteredTask = this._remindmeTask.filter(
            r =>
                r.parse!.id.includes(task.parse!.id) &&
                r.parse!.id.indexOf(task.parse!.id) === 0,
        );

        if (filteredTask.length === 0) {
            this._tgBot.sendMessage(
                task.chatId,
                `Oh oh, Cannot find reminder with id ${task.parse!.id}`,
            );
            return;
        }

        if (filteredTask.length > 1) {
            this._tgBot.sendMessage(
                task.chatId,
                "Found more than 1 task. Try to provide a longer id",
            );
            return;
        }

        const indexTask = this._remindmeTask.indexOf(filteredTask[0]);

        this._remindmeTask[indexTask].cron?.stop();
        this._remindmeTask.splice(indexTask, 1);

        this._tgBot.sendMessage(
            task.chatId,
            `task ${task.parse?.id} successfully deleted`,
        );
    }

    private processHelp(task: RemindmeTask): void {
        this._tgBot.sendMessage(task.chatId, task.parse!.displayText);
    }
}

export default RemindMeTgBot;
