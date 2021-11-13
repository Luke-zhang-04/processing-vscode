/**
 * Processing-vscode - Processing Language Support for VSCode
 *
 * @copyright (C) 2021 Luke Zhang
 */

import vscode from "vscode"

const getProcessingCommand = (): string => {
    const config = vscode.workspace
        .getConfiguration()
        .get<unknown>("processing.processingPath", "processing-java")

    if (typeof config !== "string") {
        const msg = "Config option processing.processingPath must be of type string"

        vscode.window.showErrorMessage(msg)

        throw new Error(msg)
    }

    return config
}

const getJavaCommand = (): string => {
    const config = vscode.workspace
        .getConfiguration()
        .get<unknown>("processing.py.javaPath", "java")

    if (typeof config !== "string") {
        const msg = "Config option processing.py.javaPath must be of type string"

        vscode.window.showErrorMessage(msg)

        throw new Error(msg)
    }

    return config
}

const getJarPath = (): string => {
    const config = vscode.workspace
        .getConfiguration()
        .get<unknown>("processing.py.jarPath", "processing-py.jar")

    if (typeof config !== "string") {
        const msg = "Config option processing.py.jarPath must be of type string"

        vscode.window.showErrorMessage(msg)

        throw new Error(msg)
    }

    return config
}

const getShouldEnablePython = (): boolean => {
    const isEnabled = vscode.workspace
        .getConfiguration()
        .get<boolean>("processing.py.isEnabled", true)

    if (typeof isEnabled !== "boolean") {
        const msg = "Config option processing.py.isEnabled should be a boolean"

        vscode.window.showErrorMessage(msg)

        throw new Error(msg)
    }

    return isEnabled
}

type DocOptions = "processing.org" | "p5js.org" | "py.processing.org" | "auto"
type SearchEngines = "Google" | "DuckDuckGo"

const getSearchConfig = (): {searchEngine: SearchEngines; processingDocs: DocOptions} => {
    const config = vscode.workspace.getConfiguration("processing")
    const processingDocs = config.get<DocOptions>("docs", "auto")
    const searchEngine = config.get<SearchEngines>("search", "Google")

    if (!["processing.org", "p5js.org", "py.processing.org", "auto"].includes(processingDocs)) {
        const msg =
            'Config option processing.docs must be "processing.org" | "p5js.org" | "py.processing.org" | "auto"'

        vscode.window.showErrorMessage(msg)

        throw new Error(msg)
    } else if (!["Google", "DuckDuckGo"].includes(searchEngine)) {
        const msg = 'Config option processing.search must be "Google" | "DuckDuckGo"'

        vscode.window.showErrorMessage(msg)

        throw new Error(msg)
    }

    return {
        searchEngine,
        processingDocs,
    }
}

const getshouldEnableDiagnostics = (): boolean => {
    const shouldGiveDiagnostics = vscode.workspace
        .getConfiguration()
        .get<boolean>("processing.shouldGiveDiagnostics", true)

    if (typeof shouldGiveDiagnostics !== "boolean") {
        const msg = "Config option processing.shouldGiveDiagnostics must be of type boolean"

        vscode.window.showErrorMessage(msg)

        throw new Error(msg)
    }

    return shouldGiveDiagnostics
}

const getQuoteEnablement = (): boolean => {
    const shouldQuotePath = vscode.workspace
        .getConfiguration()
        .get<"always" | "auto">("processing.runPathQuotes", "auto")

    if (shouldQuotePath !== "always" && shouldQuotePath !== "auto") {
        const msg = 'Config option processing.runPathQuotes should be "auto" or "always"'

        vscode.window.showErrorMessage(msg)

        throw new Error(msg)
    }

    return shouldQuotePath === "always"
}

const getShouldSendSigint = (): boolean => {
    const isEnabled = vscode.workspace
        .getConfiguration()
        .get<boolean>("processing.shouldSendSigint", false)

    if (typeof isEnabled !== "boolean") {
        const msg = "Config option processing.shouldSendSigint must be of type boolean"

        vscode.window.showErrorMessage(msg)

        throw new Error(msg)
    }

    return isEnabled
}

export const processingCommand = getProcessingCommand()
export const javaCommand = getJavaCommand()
export const jarPath = getJarPath()
export const shouldEnablePython = getShouldEnablePython()
export const searchConfig = getSearchConfig()
export const shouldEnableDiagnostics = getshouldEnableDiagnostics()
export const shouldAlwaysQuotePath = getQuoteEnablement()
export const shouldSendSigint = getShouldSendSigint()

export default {
    processingCommand,
    javaCommand,
    jarPath,
    shouldEnablePython,
    searchConfig,
    shouldEnableDiagnostics,
    shouldAlwaysQuotePath,
    shouldSendSigint,
}
