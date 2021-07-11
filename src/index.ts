/**
 * Processing-vscode - Processing Language Support for VSCode
 *
 * @version 2.4.0
 * @copyright (C) 2016 - 2020 Tobiah Zarlez, 2021 Luke Zhang
 */

import {processingCommand, shouldEnableDiagnostics} from "./config"
import isValidProcessingCommand from "./validateCommand"
import subscribeCommands from "./commands"
import subscribeDiagnostics from "./diagnostics"
import vscode from "vscode"

export const activate = async (context: vscode.ExtensionContext) => {
    const log = vscode.window.createOutputChannel("Processing")

    log.appendLine("Activating Processing language extension...")

    subscribeCommands(context)

    if (shouldEnableDiagnostics) {
        if (await isValidProcessingCommand(processingCommand)) {
            const pdeDiagnostics = vscode.languages.createDiagnosticCollection("processing")

            context.subscriptions.push(pdeDiagnostics)
            subscribeDiagnostics(pdeDiagnostics, context, log)
        } else {
            log.appendLine(
                `ERROR! The configured processing command ${processingCommand} could not be executed.`,
            )
            log.show()
        }
    }

    await import("./documentation")

    log.appendLine("Processing language extension is now active!")
}

// this method is called when your extension is deactivated
export const deactivate = () => {}
