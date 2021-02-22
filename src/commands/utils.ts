/**
 * processing-vscode - Processing Language Support for VSCode
 * @version 1.5.0
 * @copyright (C) 2016 - 2020 Tobiah Zarlez, 2021 Luke Zhang
 */

import fs from "fs"
import * as search from "../search"
import vscode from "vscode"

export const remindAddToPath = async () => {
    const item = await vscode.window.showInformationMessage(
        "Remember to add Processing to your path!",
        "Learn More",
    )

    if (item === "Learn More") {
        // Open a URL using the npm module "open"
        search.openURL("https://github.com/Luke-zhang-04/processing-vscode#add-processing-to-path")
    }
}

export function copyFile(source: fs.PathLike, target: fs.PathLike, cb: Function) {
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

export function checkIfProjectOpen(callback: Function) {
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

export const openDocErrorMessage = async (str: string) => {
    const item = await vscode.window.showErrorMessage("Error: " + str, "Open Docs")

    if (item === "Open Docs") {
        search.openURL("docs")
    }
}
