import fs from "fs";
import FileAccessor from "../src/FileAccessor";

const fakeFilepath = "\\fakefile.txt";

describe("CRUD on file accessor", () => {
    beforeEach(() => jest.restoreAllMocks());

    it("throw error on unsuccesful reading the file", () => {
        jest.spyOn(fs, "readFileSync").mockImplementationOnce(() => {
            throw new Error();
        });

        const file = new FileAccessor(fakeFilepath);

        expect(() => {
            file.read();
        }).toThrowError("unable to read the file");
        expect(fs.readFileSync).toHaveBeenNthCalledWith(1, fakeFilepath, {
            encoding: "utf8",
        });
    });

    it("append task to file", () => {
        jest.spyOn(fs, "appendFileSync").mockReturnValueOnce(undefined);

        const file = new FileAccessor(fakeFilepath);
        file.append("appended text");

        expect(fs.appendFileSync).toHaveBeenCalledWith(
            fakeFilepath,
            "appended text",
        );
    });

    it("delete task in file", () => {
        const content = "Text 1\nText 2\nText 3";

        jest.spyOn(fs, "readFileSync").mockReturnValue(content);
        jest.spyOn(fs, "writeFileSync").mockReturnValueOnce(undefined);

        const file = new FileAccessor(fakeFilepath);
        file.delete("Text 2");

        expect(fs.writeFileSync).toHaveBeenCalledWith(
            fakeFilepath,
            "Text 1\nText 3",
        );
        expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    });
});
