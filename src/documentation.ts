import * as vscode from "vscode"
import * as documentation from "./documentation-data.json"
import {promises as fs} from "fs"
import {type} from "os"

/**
 * Gets the hovered "thing" and returns it
 * @param line - contents of line
 * @param position - position of hover
 */
const getHoveredItem = (line: string, position: number): string => {
    const itemStart = (() => {
        let index = position

        for (; index >= 0 && index < line.length; index--) {
            if (!/[A-z]|[0-9]/u.test(line[index])) {
                break
            }
        }

        return index + 1
    })()

    const itemEnd = (() => {
        let index = position

        for (; index >= 0 && index < line.length; index++) {
            if (!/[A-z]|[0-9]/u.test(line[index])) {
                break
            }
        }

        return index
    })()

    return line.slice(itemStart, itemEnd)
}

/* prettier-ignore */

type DocumentationItem = {
    description: string
    syntax: string
    parameters: {[key: string]: string}
    returns: string
    docUrl: string
};

vscode.languages.registerHoverProvider(
    {scheme: "file", language: "pde"},
    {
        provideHover: async (document, position) => {
            console.log(documentation)

            const contents = (await fs.readFile(document.uri.fsPath)).toString()

            const line = contents.split("\n")[position.line]

            if (!line) {
                return
            }

            const item = getHoveredItem(line, position.character) as keyof typeof documentation
            const info = documentation[item] as DocumentationItem | undefined

            if (!info) {
                return
            }

            const params = Object.entries(info.parameters).map(([name, desc]) => {
                const typeDefs = desc.indexOf(":")

                if (typeDefs === -1) {
                    return `@param \`${name}\` — ${desc}`
                }

                const formattedDesc = `\`${desc.slice(0, typeDefs)}\`${desc.slice(typeDefs)}`

                return `@param \`${name}\` — ${formattedDesc}`
            })
            const {returns} = info

            return new vscode.Hover([
                `\`\`\`processing
${info.syntax}
\`\`\``,
                `**${item}**

${info.description}

@see {@link [${info.docUrl}](${info.docUrl})}

${params.join("\n\n")}

@returns ${returns === "void" ? "`void`" : returns}
`,
            ])
        },
    },
)