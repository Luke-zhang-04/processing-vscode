/**
 * Processing-vscode - Processing Language Support for VSCode
 *
 * @copyright (C) 2021 Luke Zhang
 */

import {jarPath, javaCommand, processingCommand, shouldAlwaysQuotePath} from "../config"
import path, {dirname} from "path"
import {isValidProcessingProject} from "../utils"
import vscode from "vscode"

const pythonUtils = {
    getProjectFilename: ({fileName}: vscode.TextDocument): string =>
        shouldAlwaysQuotePath || / |\\/u.test(fileName) ? `"${fileName}"` : fileName,

    getJarFilename: (): string =>
        shouldAlwaysQuotePath || / |\\/u.test(jarPath) ? `"${jarPath}"` : jarPath,
}

class RunManager {
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
     * This monstrosity searches for an existing terminal if it exists or creates a new one and returns it.
     *
     * @param terminalName - Key of terminal in class
     * @param terminalDisplayName - Display name of terminal
     * @returns Vscode terminal
     */
    private _getTerminal = (
        terminalName: "_terminal" | "_pythonTerminal",
        terminalDisplayName: string,
    ): vscode.Terminal =>
        (this[terminalName] !== undefined && this[terminalName]?.exitStatus === undefined // Terminal exists
            ? vscode.window.terminals.find((terminal) => terminal.name === terminalDisplayName) // Find existing terminal
            : (this[terminalName] = vscode.window.createTerminal(terminalDisplayName))) ?? // Terminal doesn't exist; create a new terminal
        (this[terminalName] = vscode.window.createTerminal(terminalDisplayName)) // Somehow couldn't find an existing terminal

    /**
     * Runs the current project in Java mode
     *
     * @param editor - Vscode text editor
     */
    private _runJavaMode = (editor: vscode.TextEditor): void => {
        const currentTerminal = this._getTerminal("_terminal", "Processing")

        let sketchName = dirname(editor.document.fileName)
        const isValidProjectName = isValidProcessingProject(sketchName.split(path.sep).pop())
        const shouldQuotePath = shouldAlwaysQuotePath || / |\\/u.test(sketchName)

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
        const cmd = `${processingCommand} --sketch=${sketchName} --run`

        currentTerminal.sendText(cmd)
    }

    /**
     * Runs the current project in Python mode
     *
     * @param editor - Vscode text editor
     */
    private _runPythonMode = (editor: vscode.TextEditor): void => {
        const currentTerminal = this._getTerminal("_pythonTerminal", "Processing-py")

        currentTerminal.show()

        // If file is a processing project file
        const cmd = `${javaCommand} -jar ${pythonUtils.getJarFilename()} ${pythonUtils.getProjectFilename(
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
