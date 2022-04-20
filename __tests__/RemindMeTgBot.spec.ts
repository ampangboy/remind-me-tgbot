import RemindMeTgBot from "../src/RemindMeTgBot";
import TelegramBotWrapperMock from "../src/TelegramBotWrapper";
import { MessageInfo } from "node-telegram-bot-api";
import EventEmitter from "regexemitter";
import ReminderParserMock, { Reminder } from "../src/ReminderParser";

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

    it("will not act if text message start with /remindme and not able to parse the text", () => {
        const text = "/remindme random text";

        ReminderParserMock.tryParse = jest
            .fn()
            .mockImplementation((): Reminder => {
                return { canParse: false };
            });

        setupSendMessageEvent(text);

        expect(ReminderParserMock.tryParse).toHaveBeenCalledTimes(1);
        expect(ReminderParserMock.tryParse).toHaveBeenCalledWith(text);

        expect(bot.reminderQueue.length).toEqual(0);
    });
});
