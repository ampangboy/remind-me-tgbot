import RemindMeTgBot from "../src/RemindMeTgBot";
import TelegramBotWrapperMock from "../src/TelegramBotWrapper";
import { MessageInfo } from "node-telegram-bot-api";
import EventEmitter from "regexemitter";
import RemindmeParserMock, {
    RemindmeTask,
    RemindmeCommand,
} from "../src/RemindmeParser";
import CronNodeWrapperMock from "../src/CronNodeWrapper";

jest.mock("../src/TelegramBotWrapper");
jest.mock("../src/RemindmeParser");
jest.mock("../src/CronNodeWrapper");

let fakeToken: string;
let bot: RemindMeTgBot;

beforeAll(() => {
    jest.clearAllMocks();

    fakeToken = "randomToken";

    bot = new RemindMeTgBot(fakeToken);
});

describe("Instantiate RemindMetgBot", () => {
    it("called the wrapper constructor with token as parameter", () => {
        expect(TelegramBotWrapperMock).toHaveBeenCalledTimes(1);
        expect(TelegramBotWrapperMock).toHaveBeenCalledWith(fakeToken);
    });

    it("called the onText method with '/remindme' and a callback as parameter", () => {
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
        bot.remindmeTask.pop();
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

    const fakeMatch: string[] = [];
    const fakeMessageInfo: MessageInfo = {
        chat: {
            id: 0,
        },
        text: "text",
    };

    const setupSendMessageEvent = (text: string) => {
        fakeMessageInfo.text = text;
        onTextEvent.emit(text, fakeMessageInfo, fakeMatch);
    };

    it("will not try parse text message if received text message do not start with /remindme", () => {
        setupSendMessageEvent("/randomText /remindme");

        expect(RemindmeParserMock.tryParse).toHaveBeenCalledTimes(0);
    });

    it("will provide help message if text is not parsable", () => {
        const text = "/remindme random text";

        const failParseText =
            'Ouh! Sorry, I\'m having trouble to understand the instruction. Type "/remindme HELP" for usage';

        RemindmeParserMock.tryParse = jest
            .fn()
            .mockImplementation((): RemindmeTask => {
                return {
                    canParse: false,
                    chatId: 0,
                };
            });

        setupSendMessageEvent(text);

        expect(RemindmeParserMock.tryParse).toHaveBeenCalledTimes(1);
        expect(RemindmeParserMock.tryParse).toHaveBeenCalledWith(
            fakeMessageInfo,
        );

        expect(
            TelegramBotWrapperMock.prototype.sendMessage,
        ).toHaveBeenCalledWith(fakeMessageInfo.chat.id, failParseText);

        expect(bot.remindmeTask.length).toEqual(0);
    });

    it("process the text message if text is parsable with command ADD", () => {
        const text = "/remindme random text";
        const fakeReminder: RemindmeTask = {
            canParse: true,
            chatId: 0,
            parse: {
                id: "text",
                fullText: "text",
                command: RemindmeCommand.Add,
                cronExpression: "text",
                displayText: "text",
                note: "text",
            },
        };

        RemindmeParserMock.tryParse = jest
            .fn()
            .mockImplementation((): RemindmeTask => fakeReminder);

        setupSendMessageEvent(text);

        expect(RemindmeParserMock.tryParse).toHaveBeenCalledTimes(1);
        expect(RemindmeParserMock.tryParse).toHaveBeenCalledWith(
            fakeMessageInfo,
        );

        expect(CronNodeWrapperMock.prototype.schedule).toBeCalledWith(
            fakeReminder.parse!.cronExpression,
            expect.any(Function),
        );
        expect(CronNodeWrapperMock.prototype.schedule).toHaveBeenCalledTimes(1);
        expect(CronNodeWrapperMock.prototype.start).toHaveBeenCalledTimes(1);

        expect(bot.remindmeTask).toHaveLength(1);
        expect(bot.remindmeTask[0].cron).not.toBe(undefined);

        expect(
            TelegramBotWrapperMock.prototype.sendMessage,
        ).toHaveBeenCalledTimes(1);
        expect(
            TelegramBotWrapperMock.prototype.sendMessage,
        ).toHaveBeenCalledWith(
            fakeReminder.chatId,
            fakeReminder.parse?.displayText,
        );
    });

    it("process the text message with command DELETE", () => {
        const fakeId = "partialID";
        const text = `/remindme DELETE ${fakeId}`;
        fakeMessageInfo.text = text;
        const fakeTaskToRemove: RemindmeTask = {
            canParse: true,
            chatId: 0,
            parse: {
                id: fakeId,
                fullText: "text",
                command: RemindmeCommand.Add,
                cronExpression: "text",
                displayText: "text",
                note: "text",
            },
        };

        const fakeTask: RemindmeTask = {
            canParse: true,
            chatId: 0,
            parse: {
                id: fakeId,
                fullText: "fake text",
                command: RemindmeCommand.Delete,
                displayText: "fake display Text",
            },
        };

        RemindmeParserMock.tryParse = jest
            .fn()
            .mockImplementation((): RemindmeTask => fakeTask);

        bot.remindmeTask.push(fakeTaskToRemove);

        setupSendMessageEvent(text);

        expect(bot.remindmeTask).toHaveLength(0);
    });
});
