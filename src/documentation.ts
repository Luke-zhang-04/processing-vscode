/**
 * Processing-vscode - Processing Language Support for VSCode
 *
 * @copyright (C) 2021 Luke Zhang
 */

import type {
    Documentation,
    DocumentationClass,
    DocumentationFunction,
    DocumentationVariable,
} from "./types"
import documentation from "./documentation-data.yml"
import vscode from "vscode"

/**
 * Gets the hovered "thing" and returns it
 *
 * @param line - Contents of line
 * @param position - Position of hover
 */
const getHoveredItem = (line: string, position: number): string | undefined => {
    if (/\/\//u.test(line.slice(0, position))) {
        return
    }

    const itemStart = (() => {
        let index = position

        for (; index >= 0 && index < line.length; index--) {
            if (!/[a-z]|[0-9]|_/iu.test(line[index]!)) {
                break
            }
        }

        return index + 1
    })()

    const itemEnd = (() => {
        let index = position

        for (; index >= 0 && index < line.length; index++) {
            if (!/[a-z]|[0-9]|_/iu.test(line[index]!)) {
                break
            }
        }

        return index
    })()

    return line.slice(itemStart, itemEnd)
}

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
            const item = getHoveredItem(line.text, position.character) as
                | keyof typeof documentation
                | undefined

            if (item === undefined) {
                return
            }

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
