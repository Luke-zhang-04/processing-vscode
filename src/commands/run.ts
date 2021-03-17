/**
 * processing-vscode - Processing Language Support for VSCode
 * @version 2.0.3
 * @copyright (C) 2016 - 2020 Tobiah Zarlez, 2021 Luke Zhang
 */

import {dirname} from "path"
import {getProcessingCommand} from "../getConfig"
import vscode from "vscode"

class RunManager {
    private _terminal: vscode.Terminal | undefined = undefined

    public run = (): void => {
        const {activeTextEditor: editor} = vscode.window

        if (!editor) {
            vscode.window.showErrorMessage("No active text editor found")

            return
        }

        if (/\.pde$/u.test(editor.document.fileName)) {
            const currentTerminal = (this._terminal ??= // Readability 100
                vscode.window.terminals.find((terminal) => terminal.name === "Processing") ??
                vscode.window.createTerminal("Processing"))

            currentTerminal.show()

            // If file is a processing project file
            const cmd = `${getProcessingCommand()} --sketch="${dirname(
                editor.document.fileName,
            )}" --run`

            currentTerminal.sendText(cmd)
        }
    }
}

const runManager = new RunManager()

/**
 * Runs the current processing project
 * @param editor - vscode text editor
 * @param log - vscode output log
 */
export const {run} = runManager
