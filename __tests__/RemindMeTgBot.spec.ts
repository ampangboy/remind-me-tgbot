import RemindMeTgBot from "../src/RemindMeTgBot";
import TelegramBotWrapperMock from "../src/TelegramBotWrapper";
import { MessageInfo } from "node-telegram-bot-api";
import EventEmitter from "regexemitter";
import ReminderParserMock from "../src/ReminderParser";

jest.mock("../src/TelegramBotWrapper");
jest.mock("../src/ReminderParser");

let fakeToken: string;
let bot: RemindMeTgBot;

beforeAll(() => {
    jest.clearAllMocks();

    fakeToken = "randomToken";

    bot = new RemindMeTgBot(fakeToken);
});

describe("Instantiate RemindMetgBot", () => {
    it("it called the wrapper constructor with token as parameter", () => {
        expect(TelegramBotWrapperMock).toHaveBeenCalledTimes(1);
        expect(TelegramBotWrapperMock).toHaveBeenCalledWith(fakeToken);
    });

    it("it called the onText method with '/remindme' and a callback as parameter", () => {
        expect(TelegramBotWrapperMock.prototype.onText).toHaveBeenCalledWith(
            /^\/remindme (.+)/,
            expect.any(Function),
        );
        expect(TelegramBotWrapperMock.prototype.onText).toHaveBeenCalledTimes(
            1,
        );
    });
});

describe("receiving text message", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const onTextEvent = new EventEmitter();

    TelegramBotWrapperMock.prototype.onText = jest
        .fn()
        .mockImplementation(
            (
                regexp: RegExp,
                callback: (msg: MessageInfo, match: Array<unknown>) => void,
            ) => {
                onTextEvent.on(regexp, callback);
            },
        );

    const mockMatch: string[] = [];
    const mockMessageInfo: MessageInfo = {
        chat: {
            id: 0,
        },
        text: "",
    };

    const setupSendMessageEvent = (text: string) => {
        mockMessageInfo.text = text;
        onTextEvent.emit(text, mockMessageInfo, mockMatch);
    };

    it("will not act if received text message which do not start with /remindme", () => {
        setupSendMessageEvent("/randomText /remindme");

        expect(bot.reminderQueue.length).toEqual(0);
    });

    it("will store reminder if text message start with /remindme", () => {
        const text = "/remindme random text";

        setupSendMessageEvent(text);

        expect(bot.reminderQueue.length).toEqual(1);
        expect(bot.reminderQueue[0]).toEqual(text);
    });

    it("will call reminder text parser if textmessage start with /remindme", () => {
        const text = "/remindme random text";

        setupSendMessageEvent(text);

        expect(ReminderParserMock.parse).toHaveBeenCalledTimes(1);
        expect(ReminderParserMock.parse).toHaveBeenCalledWith(text);
    });
});
