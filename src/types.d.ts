export interface DocumentationClass {
    description: string
    syntax: string
    parameters: {[key: string]: string}
    docUrl: string
    type: "class"
}

export interface DocumentationFunction {
    description: string
    syntax: string
    parameters: {[key: string]: string}
    returns: string
    docUrl: string
    type: "function"
}

export interface DocumentationVariable {
    description: string
    examples?: string
    docUrl: string
    type: "var" | "const"
}

export type Documentation = {
    [key: string]: DocumentationFunction | DocumentationVariable | DocumentationClass
}
