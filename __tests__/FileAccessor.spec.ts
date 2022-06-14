import fs from "fs";

const fakeFilepath = "\\fakefile.txt";

describe("CRUD on file accessor", () => {
    beforeEach(() => jest.restoreAllMocks());

    it("throw error on unsuccesful reading the file", () => {
        jest.spyOn(fs, "readFileSync").mockImplementationOnce(() => {
            throw new Error();
        });

        const fileAccesor = new FileAccessor(fakeFilepath);

        expect(fileAccesor.read()).toThrow(IO_Error);
    });

    it("append task to file", () => {
        jest.spyOn(fs, "appendFileSync").mockReturnValueOnce(undefined);

        const fileAccesor = new FileAccessor(fakeFilepath);
        fileAccesor.append("appended text");

        expect(fs.appendFileSync).toHaveBeenCalledWith(
            fakeFilepath,
            "\nappended text",
        );
    });

    it("read and delete task in file", () => {
        const firstLine = "Text 1\nText 2";
        const buff = Buffer.from(firstLine, "utf8");

        jest.spyOn(fs, "readFileSync").mockReturnValue(buff);
        jest.spyOn(fs, "writeFileSync").mockReturnValueOnce(undefined);

        const fileAccesor = new FileAccessor(fakeFilepath);
        fileAccesor.delete("Text 2");

        expect(fs.writeFileSync).toHaveBeenCalledWith("fakeFilepath", "Text1");
    });
});
