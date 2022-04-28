import RemindmeParser from "../src/RemindmeParser";
import { MessageInfo } from "node-telegram-bot-api";

describe("Parsing command", () => {
    const fakeChatId = 0;

    const fakeMsg: MessageInfo = {
        chat: {
            id: fakeChatId,
        },
        text: "",
    };

    it("cannot parse command with no argument", () => {
        fakeMsg.text = "/remindme   ";
        const task = RemindmeParser.tryParse(fakeMsg);

        expect(task.canParse).toBe(false);
    });

    it("cannot parse EVERYDAY command without note", () => {
        fakeMsg.text = "/remindme EVERYDAY";
        const task = RemindmeParser.tryParse(fakeMsg);

        expect(task.canParse).toBe(false);
    });

    it("can parse EVERYDAY command", () => {
        const fakeNote = "fake note";
        fakeMsg.text = `/remindme EVERYDAY ${fakeNote}`;

        const task = RemindmeParser.tryParse(fakeMsg);

        expect(task.canParse).toBe(true);
        expect(task.parse!.cronExpression).toBe("0 4 * * *");
    });

    it("cannot parse EVERYWEEK without note", () => {
        fakeMsg.text = "/remindme EVERYWEEK";

        const task = RemindmeParser.tryParse(fakeMsg);

        expect(task.canParse).toBe(false);
    });

    it("can parse EVERYWEEK", () => {
        const fakeNote = "fake note";
        fakeMsg.text = `/remindme EVERYWEEK ${fakeNote}`;

        const task = RemindmeParser.tryParse(fakeMsg);

        expect(task.canParse).toBe(true);
        expect(task.parse!.cronExpression).toBe("0 4 * * 1");
    });

    it("can parse EVERYWEEK with optional argument days", () => {
        const fakeNote = "fake note";
        const optionalArgs: string[] = [
            "SUN",
            "MON",
            "TUE",
            "WED",
            "THU",
            "FRI",
            "SAT",
        ];

        optionalArgs.forEach((arg, i) => {
            fakeMsg.text = `/remindme EVERYWEEK ${fakeNote} ${arg}`;

            const task = RemindmeParser.tryParse(fakeMsg);

            expect(task.canParse).toBe(true);
            expect(task.parse!.cronExpression).toBe(`0 4 * * ${i}`);
        });
    });
});
