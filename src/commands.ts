/**
 * processing-vscode - Processing Language Support for VSCode
 * @version 1.5.0
 * @copyright (C) 2016 - 2020 Tobiah Zarlez, 2021 Luke Zhang
 */

import * as search from "./search"
import {processingCommand, buildProcessingArgs, processingTaskFilename} from "./processing-tasks"
import childProcess from "child_process"
import fs from "fs"
import path from "path"
import vscode from "vscode"

const remindAddToPath = async () => {
    const item = await vscode.window.showInformationMessage(
        "Remember to add Processing to your path!",
        "Learn More",
    )

    if (item === "Learn More") {
        // Open a URL using the npm module "open"
        search.openURL("https://github.com/TobiahZ/processing-vscode#add-processing-to-path")
    }
}

function copyFile(source: fs.PathLike, target: fs.PathLike, cb: Function) {
    let cbCalled = false

    function done(err?: Error) {
        if (!cbCalled) {
            cb(err)
            cbCalled = true
        }
    }

    let rd = fs.createReadStream(source)
    rd.on("error", function (err: Error) {
        done(err)
    })
    let wr = fs.createWriteStream(target)
    wr.on("error", function (err: Error) {
        done(err)
    })
    wr.on("close", function () {
        done()
    })
    rd.pipe(wr)
}

function checkIfProjectOpen(callback: Function) {
    vscode.window.showWorkspaceFolderPick().then((root: vscode.WorkspaceFolder | undefined) => {
        if (root === undefined) {
            vscode.window.showErrorMessage("Open project folder first")
        } else {
            fs.stat(root.uri.fsPath + "/" + root.name + ".pde", (err, stats) => {
                if (err && err.code === "ENOENT") {
                    // Named file doesn't exist.
                    vscode.window.showErrorMessage("Create a " + root.name + ".pde file first!")
                } else if (err) {
                    vscode.window.showErrorMessage(
                        "When checking if " + root.name + ".pde exists: " + err,
                    )
                } else if (stats.isFile()) {
                    callback(root)
                }
            })
        }
    })
}

const openDocErrorMessage = async (str: string) => {
    const item = await vscode.window.showErrorMessage("Error: " + str, "Open Docs")

    if (item === "Open Docs") {
        search.openURL("docs")
    }
}

export const subscribeCommands = (
    context: vscode.ExtensionContext,
    log: vscode.OutputChannel,
): void => {
    let createTaskFile = vscode.commands.registerCommand("processing.CreateTaskFile", () => {
        const pdeTaskFile = path.join(context.extensionPath, processingTaskFilename)

        checkIfProjectOpen((root: vscode.WorkspaceFolder) => {
            let taskPath = path.join(root.uri.fsPath, ".vscode")

            function copyTaskFile(destination: string) {
                copyFile(pdeTaskFile, destination, function (err: Error) {
                    if (err) {
                        log.appendLine(err.toString())
                        console.log(err)

                        return
                    }
                    remindAddToPath()
                })
            }

            fs.stat(taskPath, (err, stats) => {
                if (err && err.code === "ENOENT") {
                    // .vscode doesn't exist, creating it
                    try {
                        fs.mkdirSync(taskPath)
                    } catch (e) {
                        if (e.code !== "EEXIST") {
                            throw e
                        }
                    }
                    copyTaskFile(path.join(taskPath, "tasks.json"))
                } else if (err) {
                    vscode.window.showErrorMessage("When checking if .vscode/ exists: " + err)
                } else if (stats.isDirectory()) {
                    taskPath = path.join(taskPath, "tasks.json")

                    fs.stat(taskPath, (err, stats) => {
                        if (err && err.code === "ENOENT") {
                            // Task file doesn't exist, creating it
                            copyTaskFile(taskPath)
                        } else if (err) {
                            vscode.window.showErrorMessage(
                                "When checking if tasks.json exists: " + err,
                            )
                        } else if (stats.isFile()) {
                            return vscode.window
                                .showErrorMessage("tasks.json already exists. Overwrite it?", "Yes")
                                .then((item: string | undefined) => {
                                    if (item === "Yes") {
                                        copyTaskFile(taskPath)
                                    }
                                })
                        }

                        return
                    })
                }
            })
        })
    })
    context.subscriptions.push(createTaskFile)

    let runTaskFile = vscode.commands.registerCommand("processing.RunTaskFile", () => {
        checkIfProjectOpen((root: vscode.WorkspaceFolder) => {
            const cmd = `${processingCommand} ${buildProcessingArgs(root.uri.fsPath).join(" ")}`
            childProcess.exec(cmd, (err, stdout) => {
                if (err) {
                    console.error(err)
                    return
                }
                log.appendLine(stdout)
                console.log(stdout)
            })
        })
    })
    context.subscriptions.push(runTaskFile)

    let openDocumentation = vscode.commands.registerCommand(
        "processing.OpenExtensionDocumentation",
        () => {
            search.openURL(
                "https://github.com/TobiahZ/processing-vscode#processing-for-visual-studio-code",
            )
        },
    )
    context.subscriptions.push(openDocumentation)

    // Open Processing Documentation, when you already have something you want to search selected
    let OpenDocs = vscode.commands.registerTextEditorCommand(
        "processing.OpenDocs",
        (textEditor: vscode.TextEditor) => {
            // selection[0] is the start, and selection[1] is the end
            let selection = textEditor.selection
            if (!selection.isSingleLine) {
                openDocErrorMessage("Multiple lines selected, please select a class or function.")
                return
            }

            let range = undefined
            if (!selection.isEmpty) {
                // selection is not empty, get text from it
                range = new vscode.Range(selection.start, selection.end)
            } else {
                // selection is empty, get any word at cursor
                range = textEditor.document.getWordRangeAtPosition(selection.active)
            }

            if (range === undefined) {
                openDocErrorMessage(
                    'Nothing is selected. Please select a class, or use "Search Documentation" instead!',
                )
                return
            }

            search.openProcessingDocs(
                textEditor.document.lineAt(range.start.line).text,
                range.start.character,
                range.end.character,
            )
        },
    )
    context.subscriptions.push(OpenDocs)

    let searchUnityDocs = vscode.commands.registerCommand("processing.SearchWebsite", () => {
        vscode.window
            .showInputBox({
                prompt: "Search Processing Website:",
            })
            .then((result: string | undefined) => {
                if (result !== undefined) {
                    // Use the node module "open" to open a web browser
                    search.openURL("docs", result)
                }
            })
    })
    context.subscriptions.push(searchUnityDocs)
}

export default subscribeCommands