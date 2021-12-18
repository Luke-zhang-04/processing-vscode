import {escapeExecutablePath} from "../src/utils/escapePath"

describe("test path escape", () => {
    it("should escape Windows path with space", () => {
        const originalPath = "C:\\Program Files\\processing\\processing-java"

        expect(escapeExecutablePath(originalPath)).toBe(
            "C:\\Program` Files\\processing\\processing-java",
        )
    })

    it("should escape Unix path with space", () => {
        const originalPath = "/usr/bin/something else/processing-java"

        expect(escapeExecutablePath(originalPath)).toBe(
            "/usr/bin/something\\ else/processing-java",
        )
    })

    it("should leave Windows path without spaces as is", () => {
        const originalPath = ".\\processing\\processing-java"

        expect(escapeExecutablePath(originalPath)).toBe(".\\processing\\processing-java")
    })

    it("should leave Unix path without spaces as is", () => {
        const originalPath = "/usr/bin/processing-java"

        expect(escapeExecutablePath(originalPath)).toBe("/usr/bin/processing-java")
    })

    it("should not escape already escaped spaces on Windows", () => {
        const originalPath = "C:\\Program` Files\\processing\\processing java"

        expect(escapeExecutablePath(originalPath)).toBe(
            "C:\\Program` Files\\processing\\processing` java",
        )
    })

    it("should not escape already escaped spaces on Unix", () => {
        const originalPath = "/usr/bin/something else/processing\\ java"

        expect(escapeExecutablePath(originalPath)).toBe(
            "/usr/bin/something\\ else/processing\\ java",
        )
    })

    it("should detect platform if no path seperators available", () => {
        const originalPath = "processing java"

        if (process.platform === "win32") {
            expect(escapeExecutablePath(originalPath)).toBe("processing` java")
        } else {
            expect(escapeExecutablePath(originalPath)).toBe("processing\\ java")
        }
    })

    it("should leave single path as is", () => {
        const originalPath = "processing-java"

        expect(escapeExecutablePath(originalPath)).toBe("processing-java")
    })
})
