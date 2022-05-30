declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BOT_API: string;
        }
    }
}

export {};
