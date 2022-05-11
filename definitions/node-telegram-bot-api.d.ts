declare module "node-telegram-bot-api" {
    export default class TelegramBot {
        constructor(token: string, options?: TelegramBotOptions);

        onText(
            regexp: RegExp,
            callback: (msg: MessageInfo, match: Array<T>) => void,
        ): void;

        sendMessage(chatId: number, message: string): void;

        on(event: string, callback: (msg: MessageInfo) => void): void;
    }

    export type MessageInfo = {
        message_id?: number;
        from?: {
            is_bot?: boolean;
            first_name?: string;
            last_name?: string;
            language_code?: string;
        };
        chat: {
            id: number;
            first_name?: string;
            last_name?: string;
            type?: string;
        };
        date?: number;
        text: string;
        entities?: Array<T>;
    };

    export type TelegramBotOptions = {
        polling?: boolean;
        webHook?: boolean;
        baseApiUrl?: string;
        filepath?: boolean;
        badRejection?: boolean;
    };
}
