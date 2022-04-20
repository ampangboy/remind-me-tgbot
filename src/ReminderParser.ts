class ReminderParser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static tryParse(_text: string): Reminder {
        return {
            canParse: true,
        };
    }
}

export default ReminderParser;

export type Reminder = {
    canParse: boolean;
    parse?: {
        id: string;
        fullText: string;
    };
};
