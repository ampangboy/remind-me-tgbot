import { v1 as uuidv1 } from "uuid";
import { MessageInfo } from "node-telegram-bot-api";
import CronNodeWrapper from "./CronNodeWrapper";

class RemindmeParser {
    private static _startHour = 4;

    private static _dayArg: string[] = [
        "MON",
        "TUE",
        "WED",
        "THU",
        "FRI",
        "SAT",
        "SUN",
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

        const note = token.slice(2, token.length).join();

        return {
            canParse: true,
            chatId: msg.chat.id,
            parse: {
                id: id,
                fullText: msg.text,
                command: RemindmeCommand.Add,
                displayText: `ID : ${id} %0A Note: ${note} %0A created!`,
                cronExpression: `0 ${this._startHour} * * *`,
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
        cronExpression: string;
        note: string;
    };
    cron?: CronNodeWrapper;
};

export enum RemindmeCommand {
    Add,
    Delete,
}
