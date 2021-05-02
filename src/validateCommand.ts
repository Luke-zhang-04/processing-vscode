/**
 * Processing-vscode - Processing Language Support for VSCode
 *
 * @version 2.1.0
 * @copyright (C) 2016 - 2020 Tobiah Zarlez, 2021 Luke Zhang
 */
import childProcess from "child_process"

export const isValidProcessingCommand = async (cmd: string): Promise<boolean> => {
    const result = await new Promise<false | string>((resolve) => {
        const processingProcess = childProcess.spawn(cmd, ["--help"])

        let output = ""

        processingProcess.stderr.on("data", (data) => (output += data.toString()))
        processingProcess.stdout.on("data", (data) => (output += data.toString()))

        processingProcess.on("exit", () => {
            resolve(output.trim())
        })

        processingProcess.on("error", () => resolve(false))
    })

    return typeof result === "boolean"
        ? result
        : /Command line edition for Processing/u.test(result)
}

export default isValidProcessingCommand
