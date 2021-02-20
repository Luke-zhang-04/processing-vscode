/**
 * processing - Processing Language Support for VSCode
 * @version 1.5.0
 * @copyright (C) 2016 - 2020 Tobiah Zarlez, 2021 Luke Zhang
 */

import path from "path"

/**
 * Dynamically build the args to pass to the `processing-java` command.
 *
 * @param base the base directory of the sketch
 */
export function buildProcessingArgs(base: string) {
    return ["--force", `--sketch=${base}`, path.join(`--output=${base}`, "out"), "--run"]
}

export const processingCommand = "processing-java"

export const processingTaskFilename = "ProcessingTasks.json"
