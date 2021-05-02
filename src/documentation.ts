/**
 * Processing-vscode - Processing Language Support for VSCode
 *
 * @version 2.1.0
 * @copyright (C) 2016 - 2020 Tobiah Zarlez, 2021 Luke Zhang
 */

import documentation from "./documentation-data.yml"
import vscode from "vscode"

/**
 * Gets the hovered "thing" and returns it
 *
 * @param line - Contents of line
 * @param position - Position of hover
 */
const getHoveredItem = (line: string, position: number): string => {
    const itemStart = (() => {
        let index = position

        for (; index >= 0 && index < line.length; index--) {
            if (!/[a-z]|[0-9]|_/iu.test(line[index])) {
                break
            }
        }

        return index + 1
    })()

    const itemEnd = (() => {
        let index = position

        for (; index >= 0 && index < line.length; index++) {
            if (!/[a-z]|[0-9]|_/iu.test(line[index])) {
                break
            }
        }

        return index
    })()

    return line.slice(itemStart, itemEnd)
}

interface DocumentationVariable {
    description: string
    examples?: string
    docUrl: string
    type: "var" | "const"
}

interface DocumentationClass {
    description: string
    syntax: string
    parameters: {[key: string]: string}
    docUrl: string
    type: "class"
}

interface DocumentationFunction {
    description: string
    syntax: string
    parameters: {[key: string]: string}
    returns: string
    docUrl: string
    type: "function"
}

/* prettier-ignore */
export type Documentation = {
    [key: string]: DocumentationFunction | DocumentationVariable | DocumentationClass
};

const documentVariable = (
    info: DocumentationVariable,
    item: keyof typeof documentation,
): vscode.Hover =>
    new vscode.Hover([
        info.examples
            ? `\`\`\`js
${info.type} ${item}
\`\`\`
\`\`\`java
// Examples
${info.examples}
\`\`\``
            : `\`\`\`js
${info.type} ${item}
\`\`\``,
        `${info.examples ? "" : `${item}\n\n`}${info.description}

@see {@link [${info.docUrl}](${info.docUrl})}
`,
    ])

const documentFuntion = (
    info: DocumentationFunction,
    item: keyof typeof documentation,
): vscode.Hover => {
    const params = Object.entries(info.parameters).map(([name, desc]) => {
        const typeDefs = desc.indexOf(":")

        if (typeDefs === -1) {
            return `@param \`${name}\` — ${desc}`
        }

        const formattedDesc = `\`${desc.slice(0, typeDefs)}\`${desc.slice(typeDefs)}`

        return `@param \`${name}\` — ${formattedDesc}`
    })
    const {returns} = info

    // Prepare yourself
    return new vscode.Hover([
        ...(info.syntax
            ? [
                  `\`\`\`js
${info.type} ${item}
\`\`\`
\`\`\`java
${info.syntax}
\`\`\``,
              ]
            : []),
        `${info.syntax ? "" : `${item}\n\n`}${info.description}

@see {@link [${info.docUrl}](${info.docUrl})}

${params.join("\n\n")}

${returns ? `@returns ${returns === "void" ? "`void`" : returns}` : ""}
`,
    ])
}

const documentClass = (
    info: DocumentationClass,
    item: keyof typeof documentation,
): vscode.Hover => {
    const params = Object.entries(info.parameters).map(([name, desc]) => {
        const typeDefs = desc.indexOf(":")

        if (typeDefs === -1) {
            return `@param \`${name}\` — ${desc}`
        }

        const formattedDesc = `\`${desc.slice(0, typeDefs)}\`${desc.slice(typeDefs)}`

        return `@param \`${name}\` — ${formattedDesc}`
    })

    // Prepare yourself
    return new vscode.Hover([
        ...(info.syntax
            ? [
                  `\`\`\`js
${info.type} ${item}
\`\`\`
\`\`\`java
${info.syntax}
\`\`\``,
              ]
            : []),
        `${info.syntax ? "" : `${item}\n\n`}${info.description}

@see {@link [${info.docUrl}](${info.docUrl})}

${params.join("\n\n")}
`,
    ])
}

vscode.languages.registerHoverProvider(
    {scheme: "file", language: "pde"},
    {
        provideHover: (document, position) => {
            const line = document.lineAt(position.line)
            const item = getHoveredItem(
                line.text,
                position.character,
            ) as keyof typeof documentation
            const info = (documentation as Documentation)[item]

            if (!info) {
                return
            } else if (info.type === "function") {
                return documentFuntion(info, item)
            } else if (info.type === "class") {
                return documentClass(info, item)
            }

            // Not a function or class, therefore a variable
            return documentVariable(info, item)
        },
    },
)
