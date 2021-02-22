/**
 * processing-vscode - Processing Language Support for VSCode
 * @version 1.5.0
 * @copyright (C) 2016 - 2020 Tobiah Zarlez, 2021 Luke Zhang
 */

import {createTaskFile, runTaskFile} from "./taskFile"
import {openDocumentation, openProcessingDocs, searchUnityDocs} from "./search"
import vscode from "vscode"

export const subscribeCommands = (
    context: vscode.ExtensionContext,
    log: vscode.OutputChannel,
): void => {
    context.subscriptions.push(
        vscode.commands.registerCommand("processing.CreateTaskFile", () =>
            createTaskFile(context, log),
        ),
    )

    context.subscriptions.push(
        vscode.commands.registerCommand("processing.RunTaskFile", () => runTaskFile(context, log)),
    )

    context.subscriptions.push(
        vscode.commands.registerCommand("processing.OpenExtensionDocumentation", openDocumentation),
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
