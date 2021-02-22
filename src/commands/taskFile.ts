import {checkIfProjectOpen, copyFile, remindAddToPath} from "./utils"
import {buildProcessingArgs, processingTaskFilename, processingCommand} from "../processing-tasks"
import childProcess from "child_process"
import fs from "fs"
import path from "path"
import vscode from "vscode"

export const runTaskFile = (_: vscode.ExtensionContext, log: vscode.OutputChannel) => {
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
}

export const createTaskFile = (context: vscode.ExtensionContext, log: vscode.OutputChannel) => {
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
                        vscode.window.showErrorMessage("When checking if tasks.json exists: " + err)
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
}

export default createTaskFile
