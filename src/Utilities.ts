function indexOf(text: string, texts: Array<string>): number {
    return texts.findIndex(t => t === text);
}

function splitTask(text: string): Array<string> {
    return text.split("\n");
}

export { indexOf, splitTask };
