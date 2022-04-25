import CronNodeWrapper from "./CronNodeWrapper";

class RemindmeParser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static tryParse(_text: string): RemindmeTask {
        return {
            canParse: false,
            chatId: 1822900130,
            parse: {
                id: "text",
                fullText: "text",
                command: RemindmeCommand.Add,
                cronExpression: "text",
                displayText: "text",
                note: "text",
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
