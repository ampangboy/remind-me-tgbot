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
            fakeMsg.text = `/remindme EVERYWEEK ${arg} ${fakeNote} `;

            const task = RemindmeParser.tryParse(fakeMsg);

            expect(task.canParse).toBe(true);
            expect(task.parse!.cronExpression).toBe(`0 4 * * ${i}`);
        });
    });

    it("cannot parse monthly without note", () => {
        fakeMsg.text = "/remind EVERYMONTH";

        const task = RemindmeParser.tryParse(fakeMsg);

        expect(task.canParse).toBe(false);
    });

    it("can parse EVERYMONTH", () => {
        const fakeNote = "fake note";
        fakeMsg.text = `/remindme EVERYMONTH ${fakeNote}`;

        const task = RemindmeParser.tryParse(fakeMsg);

        expect(task.canParse).toBe(true);
        expect(task.parse!.cronExpression).toBe("0 4 1 * *");
    });

    it("can parse EVERYMONTH with optional date parameter", () => {
        const fakeNote = "fake note";
        fakeMsg.text = `/remindme EVERYMONTH 10 ${fakeNote}`;

        const task = RemindmeParser.tryParse(fakeMsg);

        expect(task.canParse).toBe(true);
        expect(task.parse!.cronExpression).toBe("0 4 10 * *");
    });

    it("cannot parse DELETE without id", () => {
        fakeMsg.text = "/remindme DELETE";

        const task = RemindmeParser.tryParse(fakeMsg);

        expect(task.canParse).toBe(false);
    });

    it("cannot parse DELETE with multiple id", () => {
        fakeMsg.text = "/remindme DELETE id1 id2";

        const task = RemindmeParser.tryParse(fakeMsg);

        expect(task.canParse).toBe(false);
    });

    it("can parse DELETE command", () => {
        const fakeId = "fakeId";
        fakeMsg.text = `/remindme DELETE ${fakeId}`;

        const task = RemindmeParser.tryParse(fakeMsg);

        expect(task.canParse).toBe(true);
        expect(task.parse!.id).toBe(fakeId);
    });
});
