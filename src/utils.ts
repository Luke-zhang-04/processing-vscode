/**
 * processing-vscode - Processing Language Support for VSCode
 * @version 2.0.6
 * @copyright (C) 2016 - 2020 Tobiah Zarlez, 2021 Luke Zhang
 */

export const isValidProcessingProject = (path?: string): boolean =>
    path !== undefined && /^[\/_$a-z][\/\w$]*$/iu.test(path)
