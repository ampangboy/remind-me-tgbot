declare module "regexemitter" {
    export default class EventEmitter {
        constructor();

        // eslint-disable-next-line @typescript-eslint/ban-types
        on(regex: RegExp, callback: Function): void;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        emit(text: string, ...args: Array<any>): void;
    }
}
