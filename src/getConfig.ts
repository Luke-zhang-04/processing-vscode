/**
 * Processing-vscode - Processing Language Support for VSCode
 *
 * @copyright (C) 2021 Luke Zhang
 */

import vscode from "vscode"

export const getProcessingCommand = (): string => {
    const config = vscode.workspace
        .getConfiguration()
        .get<unknown>("processing.processingPath", "processing-java")

    if (typeof config !== "string") {
        vscode.window.showErrorMessage(
            "Config option processing.processingPath must be of type string",
        )

        throw new Error("Config option processing.processingPath must be of type string")
    }

    return config
}

export const getJavaCommand = (): string => {
    const config = vscode.workspace
        .getConfiguration()
        .get<unknown>("processing.py.javaPath", "java")

    if (typeof config !== "string") {
        vscode.window.showErrorMessage(
            "Config option processing.py.javaPath must be of type string",
        )

        throw new Error("Config option processing.py.javaPath must be of type string")
    }

    return config
}

export const getJarPath = (): string => {
    const config = vscode.workspace
        .getConfiguration()
        .get<unknown>("processing.py.jarPath", "processing-py.jar")

    if (typeof config !== "string") {
        vscode.window.showErrorMessage(
            "Config option processing.py.jarPath must be of type string",
        )

        throw new Error("Config option processing.py.jarPath must be of type string")
    }

    return config
}

export const isPythonEnabled = (): boolean => {
    const config = vscode.workspace
        .getConfiguration()
        .get<unknown>("processing.py.isEnabled", true)

    if (typeof config !== "boolean") {
        vscode.window.showErrorMessage(
            "Config option processing.py.javaPath must be of type string",
        )

        throw new Error("Config option processing.py.javaPath must be of type string")
    }

    return config
}

export const getSearchConfig = (): {searchEngine: string; processingDocs: string} => {
    const config = vscode.workspace.getConfiguration("processing")
    const processingDocs = config.get<unknown>("docs", "processing.org")
    const searchEngine = config.get<unknown>("search", "Google")

    if (typeof processingDocs !== "string" || typeof searchEngine !== "string") {
        vscode.window.showErrorMessage(
            "Config options processing.processingDocs and processing.searchEngine must be of type string",
        )

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
    const shouldGiveDiagnostics = vscode.workspace
        .getConfiguration()
        .get<boolean>("processing.shouldGiveDiagnostics", true)

    if (typeof shouldGiveDiagnostics !== "boolean") {
        vscode.window.showErrorMessage(
            "Config option processing.shouldGiveDiagnostics must be of type string",
        )

        throw new Error("Config option processing.shouldGiveDiagnostics must be of type string")
    }

    return shouldGiveDiagnostics
}

export const shouldAlwaysQuotePath = (): boolean => {
    const shouldQuotePath = vscode.workspace
        .getConfiguration()
        .get<"always" | "auto">("processing.runPathQuotes", "auto")

    if (shouldQuotePath !== "always" && shouldQuotePath !== "auto") {
        vscode.window.showErrorMessage("Config option processing.runPathQuotes should be auto or always")

        throw new Error("Config option processing.runPathQuotes should be auto or always")
    }

    return shouldQuotePath === "always"
}

export const pyIsEnabled = (): boolean => {
    const isEnabled = vscode.workspace
        .getConfiguration()
        .get<boolean>("processing.py.isEnabled", true)

    if (typeof isEnabled !== "boolean") {
        vscode.window.showErrorMessage("Config option processing.py.isEnabled should be a boolean")

        throw new Error("Config option processing.py.isEnabled should be a boolean")
    }

    return isEnabled
}
