/**
 * Processing-vscode - Processing Language Support for VSCode
 *
 * @version 2.1.0
 * @copyright (C) 2016 - 2020 Tobiah Zarlez, 2021 Luke Zhang
 */

import {getDiagnosticConfig, getProcessingCommand} from "./getConfig"
import isValidProcessingCommand from "./validateCommand"
import subscribeCommands from "./commands"
import subscribeDiagnostics from "./diagnostics"
import vscode from "vscode"

export const activate = async (context: vscode.ExtensionContext) => {
    const log = vscode.window.createOutputChannel("Processing")

    log.appendLine("Activating Processing language extension...")

    subscribeCommands(context)

    if (getDiagnosticConfig()) {
        if (await isValidProcessingCommand(getProcessingCommand())) {
            const pdeDiagnostics = vscode.languages.createDiagnosticCollection("processing")

            context.subscriptions.push(pdeDiagnostics)
            subscribeDiagnostics(pdeDiagnostics, context, log)
        } else {
            log.appendLine(
                `ERROR! The configured processing command ${getProcessingCommand()} could not be executed.`,
            )
            log.show()
        }
    }

    await import("./documentation")

    log.appendLine("Processing language extension is now active!")
}

// this method is called when your extension is deactivated
export const deactivate = () => {}
