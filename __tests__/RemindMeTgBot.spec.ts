import RemindMeTgBot from "../src/RemindMeTgBot";
import TelegramBotWrapperMock from "../src/TelegramBotWrapper";
import { MessageInfo } from "node-telegram-bot-api";
import EventEmitter from "regexemitter";

jest.mock("../src/TelegramBotWrapper");

let fakeToken: string;
let _bot: RemindMeTgBot;

beforeAll(() => {
    jest.clearAllMocks();

    fakeToken = "randomToken";

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _bot = new RemindMeTgBot(fakeToken);
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
    };

    it("will not act if received text message which do not start with /remindme", () => {
        const text = "/randomText /remindme";
        mockMessageInfo.text = text;

        onTextEvent.emit(text, mockMessageInfo, mockMatch);

        expect(_bot.reminderQueue.length).toEqual(0);
    });

    it("will store reminder if text message start with /remindme", () => {
        const text = "/remindme random text";
        mockMessageInfo.text = text;

        onTextEvent.emit(text, mockMessageInfo, mockMatch);

        expect(_bot.reminderQueue.length).toEqual(1);
    });
});
