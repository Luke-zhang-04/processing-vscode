/**
 * Processing-vscode - Processing Language Support for VSCode
 *
 * @version 2.1.0
 * @copyright (C) 2016 - 2020 Tobiah Zarlez, 2021 Luke Zhang
 */

import {getProcessingCommand, shouldAlwaysQuotePath} from "../getConfig"
import path, {dirname} from "path"
import {isValidProcessingProject} from "../utils"
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
            const currentTerminal =
                (this._terminal ??= vscode.window.terminals.find(
                    (terminal) => terminal.name === "Processing",
                )) ?? vscode.window.createTerminal("Processing")
            let sketchName = dirname(editor.document.fileName)
            const isValidProjectName = isValidProcessingProject(sketchName.split(path.sep).pop())
            const shouldQuotePath = shouldAlwaysQuotePath() || / |\\/u.test(sketchName)

            if (shouldQuotePath) {
                sketchName = `"${sketchName}"`
            }

            currentTerminal.show()

            if (!isValidProjectName) {
                vscode.window.showWarningMessage(
                    "Warning: Processing project names must be valid Java variable names. Your program may fail to run properly.",
                )
            }

            // If file is a processing project file
            const cmd = `${getProcessingCommand()} --sketch=${sketchName} --run`

            currentTerminal.sendText(cmd)
        }
    }
}

const runManager = new RunManager()

/**
 * Runs the current processing project
 *
 * @param editor - Vscode text editor
 * @param log - Vscode output log
 */
export const {run} = runManager
