import { v1 as uuidv1 } from "uuid";
import { MessageInfo } from "node-telegram-bot-api";
import CronNodeWrapper from "./CronNodeWrapper";

class RemindmeParser {
    private static _startHour = 4;

    private static _dayArg: string[] = [
        "SUN",
        "MON",
        "TUE",
        "WED",
        "THU",
        "FRI",
        "SAT",
    ];

    static tryParse(msg: MessageInfo): RemindmeTask {
        const token: string[] = msg.text.split(" ");
        const failRes: RemindmeTask = {
            canParse: false,
            chatId: msg.chat.id,
        };
        let res: RemindmeTask;

        // if token length is 1, text only contain the /remindme with not schedule argument
        if (token.length === 1) {
            return failRes;
        }

        const scheduleArg = token[1];

        switch (scheduleArg) {
            case "EVERYDAY":
                res = this.processEverydayCommand(msg);
                break;
            case "EVERYWEEK":
                res = this.processEveryWeekCommand(msg);
                break;

            case "EVERYMONTH":
                res = this.processEveryMonthCommand(msg);
                break;
            default:
                res = failRes;
        }

        return res;
    }

    private static processEverydayCommand(msg: MessageInfo): RemindmeTask {
        const token = msg.text.split(" ");

        if (token.length === 2) {
            return {
                canParse: false,
                chatId: msg.chat.id,
            };
        }

        const id = uuidv1();

        const note = token.slice(2, token.length).join(" ");

        return {
            canParse: true,
            chatId: msg.chat.id,
            parse: {
                id: id,
                fullText: msg.text,
                command: RemindmeCommand.Add,
                displayText: `ID : ${id} \n Note: ${note} \n created!`,
                cronExpression: `0 ${this._startHour} * * *`,
                note: note,
            },
        };
    }

    private static processEveryWeekCommand(msg: MessageInfo) {
        const token = msg.text.split(" ");
        let defaultDay = 1;
        let startNoteIndex = 2;

        if (token.length === 2) {
            return {
                canParse: false,
                chatId: msg.chat.id,
            };
        }

        const foundDayIndex = this._dayArg.findIndex(d => d === token[2]);

        if (foundDayIndex !== -1) {
            defaultDay = foundDayIndex;
            startNoteIndex = 3;
        }

        const id = uuidv1();

        const note = token.slice(startNoteIndex, token.length).join(" ");

        return {
            canParse: true,
            chatId: msg.chat.id,
            parse: {
                id: id,
                fullText: msg.text,
                command: RemindmeCommand.Add,
                displayText: `ID : ${id} \nNote: ${note} \ncreated!`,
                cronExpression: `0 ${this._startHour} * * ${defaultDay}`,
                note: note,
            },
        };
    }

    private static processEveryMonthCommand(msg: MessageInfo) {
        const token = msg.text.split(" ");
        let defaultDate = 1;
        let startNoteIndex = 2;

        if (token.length === 2) {
            return {
                canParse: false,
                chatId: msg.chat.id,
            };
        }

        const foundDate = parseInt(token[2]);

        if (!isNaN(foundDate)) {
            defaultDate = foundDate;
            startNoteIndex = 3;
        }

        const id = uuidv1();

        const note = token.slice(startNoteIndex, token.length).join(" ");

        return {
            canParse: true,
            chatId: msg.chat.id,
            parse: {
                id: id,
                fullText: msg.text,
                command: RemindmeCommand.Add,
                displayText: `ID : ${id} \nNote: ${note} \ncreated!`,
                cronExpression: `0 ${this._startHour} ${defaultDate} * *`,
                note: note,
            },
        };
    }
}

export default RemindmeParser;

export type RemindmeTask = {
    canParse: boolean;
    chatId: number;
    parse?: {
        id: string;
        fullText: string;
        command: RemindmeCommand;
        displayText: string;
        cronExpression?: string;
        note?: string;
    };
    cron?: CronNodeWrapper;
};

export enum RemindmeCommand {
    Add,
    Delete,
}
