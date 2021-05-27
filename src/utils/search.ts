/**
 * Processing-vscode - Processing Language Support for VSCode
 *
 * @copyright (C) 2016 - 2020 Tobiah Zarlez, 2021 Luke Zhang
 */

import type {Documentation} from "../types"
import documentation from "../documentation-data.yml"
import {searchConfig} from "../config"
import vscode from "vscode"

const enum Urls {
    ProcessingorgDocs = "https://processing.org/reference/",
    ProcessingorgSearchGoogle = "https://www.google.com/search?as_sitesearch=processing.org&as_q=",
    ProcessingorgSearchDuckDuckGo = "https://duckduckgo.com/?q=!processing+%5C",
    P5jsDocs = "https://p5js.org/reference/",
    P5jsSearchGoogle = "https://www.google.com/search?as_sitesearch=p5js.org&as_q=",
    P5jsSearchDuckDuckGo = "https://duckduckgo.com/?q=!p5+",
}

export const openURL = async (searchBase?: string, url?: string): Promise<void> => {
    if (searchBase === "open") {
        await vscode.env.openExternal(vscode.Uri.parse(url as string))
    } else {
        const {processingDocs, searchEngine} = searchConfig
        const searchUrl = ((): string => {
            let docUrl: string | undefined

            if (searchBase === "docs") {
                if (!url) {
                    return processingDocs === "p5js.org" ? Urls.P5jsDocs : Urls.ProcessingorgDocs
                } else if (
                    (docUrl = (documentation as Documentation)[url]?.docUrl) !== undefined
                ) {
                    return docUrl
                } else if (searchEngine === "DuckDuckGo") {
                    return processingDocs === "p5js.org"
                        ? `${Urls.P5jsSearchDuckDuckGo}${url}`
                        : `${Urls.ProcessingorgSearchDuckDuckGo}${url}`
                }

                return processingDocs === "p5js.org"
                    ? `${Urls.P5jsSearchGoogle}${url}`
                    : `${Urls.ProcessingorgSearchGoogle}${url}`
            }

            return searchBase ?? ""
        })()

        await vscode.env.openExternal(vscode.Uri.parse(searchUrl))
    }

    return
}

// Slice and Trim
export const prepareInput = (input: string, start: number, end: number) => {
    // input is the whole line, part of which is selected by the user (defined by star/end)

    if (start >= end) {
        return ""
    }

    // Everything looks good by this point, so time to open a web browser!
    return input.slice(start, end).trim()
}

export const openProcessingDocs = (input: string, start: number, end: number) => {
    // Use the node module "opn" to open a web browser
    openURL("docs", prepareInput(input, start, end))
}
