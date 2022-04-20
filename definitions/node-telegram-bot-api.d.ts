declare module "node-telegram-bot-api" {
    export default class TelegramBot {
        constructor(token: string, options?: TelegramBotOptions);

        // infer the object type, need to check back with the api
        onText(
            regexp: string,
            // eslint-disable-next-line @typescript-eslint/ban-types
            callback: (msg: Object, match: Array) => void,
        ): void;
    }

    export type TelegramBotOptions = {
        pooling?: boolean;
        webHook?: boolean;
        baseApiUrl?: string;
        filepath?: boolean;
        badRejection?: boolean;
    };
}
