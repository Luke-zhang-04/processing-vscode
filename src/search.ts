/**
 * processing - Processing Language Support for VSCode
 * @version 1.5.0
 * @copyright (C) 2016 - 2020 Tobiah Zarlez, 2021 Luke Zhang
 */

const enum Urls {
    ProcessingorgDocs = "https://processing.org/reference/",
    ProcessingorgSearchGoogle = "https://www.google.com/search?as_sitesearch=processing.org&as_q=",
    ProcessingorgSearchDuckDuckGo = "https://duckduckgo.com/?q=!processing+%5C",
    P5jsDocs = "https://p5js.org/reference/",
    P5jsSearchGoogle = "https://www.google.com/search?as_sitesearch=p5js.org&as_q=",
    P5jsSearchDuckDuckGo = "https://duckduckgo.com/?q=!p5+",
}

import vscode from "vscode"

export const openURL = async (search_base?: string, s?: string) => {
    if (search_base === "open") {
        await vscode.env.openExternal(vscode.Uri.parse(s as string))
    } else {
        const config = vscode.workspace.getConfiguration("processing")
        let processingDocs = String(config.get("docs"))

        if (!s) {
            if (processingDocs === "p5js.org") {
                s = Urls.P5jsDocs
            } else {
                s = Urls.ProcessingorgDocs
            }
        } else {
            let searchEngine = String(config.get("search"))

            if (searchEngine === "DuckDuckGo") {
                if (processingDocs === "p5js.org") {
                    s = Urls.P5jsSearchDuckDuckGo + s
                } else {
                    s = Urls.ProcessingorgSearchDuckDuckGo + s
                }
            } else {
                if (processingDocs === "p5js.org") {
                    s = Urls.P5jsSearchGoogle + s
                } else {
                    s = Urls.ProcessingorgSearchGoogle + s
                }
            }
        }

        await vscode.env.openExternal(vscode.Uri.parse(s))
    }
    return true
}

// Slice and Trim
export const prepareInput = (input: string, start: number, end: number) => {
    // input is the whole line, part of which is selected by the user (defined by star/end)

    if (start >= end) {
        return ""
    }

    // Slice to the selection
    input = input.slice(start, end)

    // Trim white space
    input = input.trim()

    // Possible future addition:
    // Check right here if valid variable/function name to search?

    // Everything looks good by this point, so time to open a web browser!
    return input
}

export const openProcessingDocs = (input: string, start: number, end: number) => {
    // Use the node module "opn" to open a web browser
    openURL("docs", prepareInput(input, start, end))
}
