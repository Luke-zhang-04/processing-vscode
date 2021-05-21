/**
 * Processing-vscode - Processing Language Support for VSCode
 *
 * @copyright (C) 2021 Luke Zhang
 */

export const isValidProcessingProject = (path?: string): boolean =>
    path !== undefined && /^[/_$a-z][/\w$]*$/iu.test(path)
