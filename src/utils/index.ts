/**
 * Processing-vscode - Processing Language Support for VSCode
 *
 * @copyright (C) 2021 Luke Zhang
 */

export * as search from "./search"
export {escapeExecutablePath} from "./escapePath"

export const isValidProcessingProject = (path?: string): boolean =>
    path !== undefined && /^[/_$a-z][/\w$]*$/iu.test(path)
