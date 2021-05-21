/**
 * Processing-vscode - Processing Language Support for VSCode
 *
 * @copyright (C) 2021 Luke Zhang
 */

import {
    getJarPath,
    getJavaCommand,
    getProcessingCommand,
    shouldAlwaysQuotePath,
} from "../getConfig"
import path, {dirname} from "path"
import {isValidProcessingProject} from "../utils"
import vscode from "vscode"

class RunManager {
    private static _pythonUtils = {
        getProjectFilename: ({fileName}: vscode.TextDocument): string =>
            shouldAlwaysQuotePath() || / |\\/u.test(fileName) ? `"${fileName}"` : fileName,

        getJarFilename: (): string => {
            const jarPath = getJarPath()

            return shouldAlwaysQuotePath() || / |\\/u.test(jarPath) ? `"${jarPath}"` : jarPath
        },
    }

    private _terminal?: vscode.Terminal = undefined

    private _pythonTerminal?: vscode.Terminal = undefined

    public run = (mode?: "py" | "java"): void => {
        const {activeTextEditor: editor} = vscode.window

        if (!editor) {
            vscode.window.showErrorMessage("No active text editor found")

            return
        }

        const processingMode = (() => {
            if (mode) {
                return mode
            }

            if (/\.pde$/u.test(editor.document.fileName)) {
                return "java"
            } else if (editor.document.languageId === "python") {
                return "py"
            }

            return
        })()

        if (processingMode === "java") {
            this._runJavaMode(editor)
        } else if (processingMode === "py") {
            this._runPythonMode(editor)
        } else {
            vscode.window.showErrorMessage("Could not determine processing mode.")
        }
    }

    /**
     * Runs the current project in Java mode
     *
     * @param editor - Vscode text editor
     */
    private _runJavaMode = (editor: vscode.TextEditor): void => {
        const terminalName = "Processing"
        const currentTerminal = // Forgive me
            (this._terminal !== undefined && this._terminal.exitStatus === undefined // Terminal exists
                ? vscode.window.terminals.find((terminal) => terminal.name === terminalName) // Find existing terminal
                : (this._terminal = vscode.window.createTerminal(terminalName))) ?? // Terminal doesn't exist; create a new terminal
            (this._terminal = vscode.window.createTerminal(terminalName)) // Somehow couldn't find an existing terminal

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

    /**
     * Runs the current project in Python mode
     *
     * @param editor - Vscode text editor
     */
    private _runPythonMode = (editor: vscode.TextEditor): void => {
        const terminalName = "Processing_py"
        const currentTerminal = // Yes.
            (this._pythonTerminal !== undefined && this._pythonTerminal.exitStatus === undefined
                ? vscode.window.terminals.find((terminal) => terminal.name === terminalName)
                : (this._pythonTerminal = vscode.window.createTerminal(terminalName))) ??
            (this._pythonTerminal = vscode.window.createTerminal(terminalName))

        currentTerminal.show()

        // If file is a processing project file
        const cmd = `${getJavaCommand()} -jar ${RunManager._pythonUtils.getJarFilename()} ${RunManager._pythonUtils.getProjectFilename(
            editor.document,
        )}`

        currentTerminal.sendText(cmd)
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
