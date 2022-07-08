import fs from "fs";
import IO_Error from "./Exception";
import { indexOf, splitTask } from "./Utilities";

class FileAccessor {
    constructor(filepath: string) {
        this._filepath = filepath;
    }

    private _filepath: string;

    read(): string {
        try {
            return fs.readFileSync(this._filepath, {
                encoding: "utf8",
            });
        } catch {
            const error = new IO_Error("unable to read the file");

            if (
                fs.existsSync(this._filepath) &&
                fs.lstatSync(this._filepath).isFile()
            ) {
                error.fileInfo = fs.statSync(this._filepath);
            }

            throw error;
        }
    }

    append(text: string): void {
        fs.appendFileSync(this._filepath, text);
    }

    delete(text: string): void {
        const content = this.read();
        const contentArr = splitTask(content);
        const i = indexOf(text, contentArr);

        contentArr.splice(i, 1);

        fs.writeFileSync(this._filepath, contentArr.join("\n"));
    }
}

export default FileAccessor;
