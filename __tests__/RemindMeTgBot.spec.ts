import RemindMeTgBot from "../src/RemindMeTgBot";
import TelegramBotWrapperMock from "../src/TelegramBotWrapper";
import path from "path";
import FileAccessorMock from "../src/FileAccessor";

jest.mock("../src/TelegramBotWrapper");
jest.mock("../src/FileAccessor");

let fakeToken: string;
let bot: RemindMeTgBot;

describe("Instantiate RemindMetgBot", () => {
    beforeEach(() => {
        jest.resetAllMocks();

        fakeToken = "randomToken";
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        bot = new RemindMeTgBot(fakeToken);
    });

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

    it("called the onChannelText methid with '/remindme regex and a callback as parameter", () => {
        expect(
            TelegramBotWrapperMock.prototype.onChannelText,
        ).toHaveBeenCalledWith(/^\/remindme (.+)/, expect.any(Function));
        expect(
            TelegramBotWrapperMock.prototype.onChannelText,
        ).toHaveBeenCalledTimes(1);
    });

    it("parse stored task in file if file exists", () => {
        const filepath = path.join(__dirname, "..", "src/tasks.txt");

        expect(FileAccessorMock).toHaveBeenCalledWith(filepath);
    });
});
