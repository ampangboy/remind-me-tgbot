import RemindMeTgBot from "../src/RemindMeTgBot";
import TelegramBotWrapperMock from "../src/TelegramBotWrapper";

jest.mock("../src/TelegramBotWrapper");

describe("Instantiate RemindMetgBot", () => {
    let fakeToken: string;
    let _bot: RemindMeTgBot;

    beforeAll(() => {
        fakeToken = "randomToken";

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _bot = new RemindMeTgBot(fakeToken);
    });

    it("it called the wrapper constructor with token as parameter", () => {
        expect(TelegramBotWrapperMock).toHaveBeenCalledTimes(1);
        expect(TelegramBotWrapperMock).toHaveBeenCalledWith(fakeToken);
    });

    it("it called the onText method with '/remindme' and a callback", () => {
        expect(TelegramBotWrapperMock.prototype.onText).toHaveBeenCalledWith(
            "/remindme",
            expect.any(Function),
        );
    });
});
