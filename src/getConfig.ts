/**
 * processing-vscode - Processing Language Support for VSCode
 * @version 2.0.1
 * @copyright (C) 2016 - 2020 Tobiah Zarlez, 2021 Luke Zhang
 */

import vscode from "vscode"

export const getProcessingCommand = (): string => {
    const config = vscode.workspace
        .getConfiguration()
        .get<unknown>("processing.processingPath", "processing-java")

    if (typeof config !== "string") {
        throw new Error("Config option processing.processingPath must be of type string")
    }

    return config
}

export const getSearchConfig = (): {searchEngine: string; processingDocs: string} => {
    const config = vscode.workspace.getConfiguration("processing")
    const processingDocs = config.get<unknown>("docs", "processing.org")
    const searchEngine = config.get<unknown>("search", "Google")

    if (typeof processingDocs !== "string" || typeof searchEngine !== "string") {
        throw new Error(
            "Config options processing.processingDocs and processing.searchEngine must be of type string",
        )
    }

    return {
        searchEngine,
        processingDocs,
    }
}

export const getDiagnosticConfig = (): boolean => {
    const config = vscode.workspace
        .getConfiguration()
        .get<boolean>("processing.shouldGiveDiagnostics", true)

    if (typeof config !== "boolean") {
        throw new Error("Config option processing.shouldGiveDiagnostics must be of type string")
    }

    return config
}
