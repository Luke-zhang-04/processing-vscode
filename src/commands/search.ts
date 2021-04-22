import * as search from "../search"
import vscode from "vscode"

const openDocErrorMessage = async (str: string) => {
    const item = await vscode.window.showErrorMessage(`Error: ${str}`, "Open Docs")

    if (item === "Open Docs") {
        search.openURL("docs")
    }
}

export const openDocumentation = () => {
    search.openURL(
        "https://github.com/Luke-zhang-04/processing-vscode#processing-for-visual-studio-code",
    )
}

export const openProcessingDocs = (textEditor: vscode.TextEditor) => {
    // selection[0] is the start, and selection[1] is the end
    const {selection} = textEditor

    if (!selection.isSingleLine) {
        openDocErrorMessage("Multiple lines selected, please select a class or function.")

        return
    }

    let range = undefined

    if (selection.isEmpty) {
        // selection is empty, get any word at cursor
        range = textEditor.document.getWordRangeAtPosition(selection.active)
    } else {
        // selection is not empty, get text from it
        range = new vscode.Range(selection.start, selection.end)
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
}

export const searchUnityDocs = () => {
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
}
