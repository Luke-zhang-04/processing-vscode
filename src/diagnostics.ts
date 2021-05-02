/**
 * Processing-vscode - Processing Language Support for VSCode
 *
 * @version 2.1.0
 * @copyright (C) 2016 - 2020 Tobiah Zarlez, 2021 Luke Zhang
 */

import path, {dirname} from "path"
import childProcess from "child_process"
import crypto from "crypto"
import {getProcessingCommand} from "./getConfig"
import {isValidProcessingProject} from "./utils"
import vscode from "vscode"

let oldHash = ""

const hash = (content: {toString: () => string}) =>
    crypto.createHash("sha384").update(content.toString()).digest("hex")

const createDiagnostic = (
    lineOfText: vscode.TextLine,
    lineIndex: number,
    charIndex: number,
    message: string,
): vscode.Diagnostic => {
    const range = new vscode.Range(lineIndex, charIndex, lineIndex, lineOfText.text.length)

    const diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Error)

    diagnostic.code = "processing-java"

    return diagnostic
}

const refreshDiagnostics = async (
    diagnostics: vscode.DiagnosticCollection,
    doc: vscode.TextDocument,
    log: vscode.OutputChannel,
): Promise<void> => {
    try {
        const foundDiagnostics: vscode.Diagnostic[] = []
        let sketchName = doc.fileName.includes(".pde") ? dirname(doc.fileName) : undefined

        if (
            sketchName &&
            doc.getText() &&
            isValidProcessingProject(sketchName.split(path.sep).pop())
        ) {
            const shouldQuotePath = sketchName.includes(" ")

            if (shouldQuotePath) {
                sketchName = `"${sketchName}"`
            }

            console.log({sketchName})
            const diagnostic = await new Promise<string[]>((resolve) => {
                const processingProcess = childProcess.spawn(getProcessingCommand(), [
                    `--sketch=${sketchName}`,
                    "--build",
                ])

                const problems: string[] = []

                const handleOutput = (data: Buffer): void => {
                    for (const line of data.toString().split("\n")) {
                        if (/(:[0-9]+){4}:/gu.test(line)) {
                            problems.push(line)
                        }
                    }
                }

                processingProcess.stderr.on("data", handleOutput)
                processingProcess.stdout.on("data", handleOutput)

                processingProcess.on("exit", () => {
                    resolve(problems)
                })
            }).catch(() => undefined)

            if (!diagnostic) {
                return
            }

            if (diagnostic.length > 0) {
                log.appendLine(diagnostic.toString())
            }

            for (const result of diagnostic) {
                const splitResult = result.split(":")
                const lineIndex = Number(splitResult[1]) - 1
                const charIndex = Number(splitResult[2]) - 2

                foundDiagnostics.push(
                    createDiagnostic(
                        doc.lineAt(lineIndex),
                        lineIndex > 0 ? lineIndex : 0,
                        charIndex > 0 ? charIndex : 0,
                        splitResult.slice(5).join("").trim(),
                    ),
                )
            }

            diagnostics.set(doc.uri, foundDiagnostics)
        }
    } catch (_) {}
}

export const subscribeDiagnostics = (
    diagnostics: vscode.DiagnosticCollection,
    context: vscode.ExtensionContext,
    log: vscode.OutputChannel,
): void => {
    let isRunning = false
    let shouldRunAgain = false

    const runDiagnostics = async (
        editor: vscode.TextEditor | vscode.TextDocumentChangeEvent,
    ): Promise<void> => {
        if (isRunning) {
            shouldRunAgain = true
        } else {
            isRunning = true

            oldHash = `${editor.document.fileName} = ${hash(editor.document.getText())}`

            await refreshDiagnostics(diagnostics, editor.document, log)

            let newHash = `${editor.document.fileName} = ${hash(editor.document.getText())}`

            while (shouldRunAgain || oldHash !== newHash) {
                shouldRunAgain = false
                oldHash = newHash

                await refreshDiagnostics(diagnostics, editor.document, log)

                newHash = `${editor.document.fileName} = ${hash(editor.document.getText())}`

                if (!shouldRunAgain || oldHash === newHash) {
                    break
                }
            }

            await refreshDiagnostics(diagnostics, editor.document, log)

            isRunning = false
        }
    }

    if (vscode.window.activeTextEditor) {
        const editor = vscode.window.activeTextEditor

        runDiagnostics(editor)
    }

    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor && /\.pde/u.test(editor.document.fileName)) {
                runDiagnostics(editor)
            }
        }),
    )

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument((editor) => {
            if (/\.pde/u.test(editor.document.fileName)) {
                if (editor.contentChanges.length > 0) {
                    runDiagnostics(editor)
                }
            }
        }),
    )

    context.subscriptions.push(
        vscode.workspace.onDidCloseTextDocument((doc) => diagnostics.delete(doc.uri)),
    )
}

export default subscribeDiagnostics
