/**
 * processing-vscode - Processing Language Support for VSCode
 * @version 1.5.0
 * @copyright (C) 2016 - 2020 Tobiah Zarlez, 2021 Luke Zhang
 */

import subscribeCommands from "./commands"
import subscribeDiagnostics from "./diagnostics"
import vscode from "vscode"

export async function activate(context: vscode.ExtensionContext) {
    const log = vscode.window.createOutputChannel("Processing")

    log.appendLine("Activating Processing language extension...")
    console.log("Activating Processing language extension...")

    subscribeCommands(context)

    const pdeDiagnostics = vscode.languages.createDiagnosticCollection("processing")
    context.subscriptions.push(pdeDiagnostics)
    subscribeDiagnostics(pdeDiagnostics, context, log)

    await import("./documentation")

    log.appendLine("Processing language extension is now active!")
    console.log("Processing language extension is now active!")
}

// this method is called when your extension is deactivated
export function deactivate() {}
