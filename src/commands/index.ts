/**
 * Processing-vscode - Processing Language Support for VSCode
 *
 * @copyright (C) 2021 Luke Zhang
 */

import {openDocumentation, openProcessingDocs, searchUnityDocs} from "./search"
import {run as runProject} from "./run"
import vscode from "vscode"

export const subscribeCommands = (context: vscode.ExtensionContext): void => {
    context.subscriptions.push(vscode.commands.registerCommand("processing.Run", runProject))
    context.subscriptions.push(
        vscode.commands.registerCommand("processing.RunPy", () => runProject("py")),
    )
    context.subscriptions.push(
        vscode.commands.registerCommand("processing.RunJava", () => runProject("java")),
    )

    context.subscriptions.push(
        vscode.commands.registerCommand(
            "processing.OpenExtensionDocumentation",
            openDocumentation,
        ),
    )

    // Open Processing Documentation, when you already have something you want to search selected
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand("processing.OpenDocs", openProcessingDocs),
    )

    context.subscriptions.push(
        vscode.commands.registerCommand("processing.SearchWebsite", searchUnityDocs),
    )
}

export default subscribeCommands
