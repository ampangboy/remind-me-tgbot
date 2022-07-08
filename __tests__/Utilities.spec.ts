import { splitTask, indexOf } from "../src/Utilities";

describe("utilities", () => {
    it("split text using new line", () => {
        const text = "Text1\nText 2\nText3😀\n    text  4";

        const res = splitTask(text);

        expect(res[0]).toBe("Text1");
        expect(res[1]).toBe("Text 2");
        expect(res[2]).toBe("Text3😀");
        expect(res[3]).toBe("    text  4");
    });

    it("find the index of text provided", () => {
        const text = ["Text1", "Text 2", "Text3😀", "    text  4"];
        const findingText = "Text3😀";

        const resFound = indexOf(findingText, text);
        const resNotFound = indexOf("random", text);

        expect(resFound).toBe(2);
        expect(resNotFound).toBe(-1);
    });
});
