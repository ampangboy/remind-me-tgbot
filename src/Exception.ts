import fs from "fs";

class IO_Error extends Error {
    constructor(message: string) {
        super(message);
    }

    public fileInfo: fs.Stats | undefined;
}

export default IO_Error;
