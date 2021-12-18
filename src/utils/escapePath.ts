/**
 * Processing-vscode - Processing Language Support for VSCode
 *
 * @copyright (C) 2021 Luke Zhang
 */

export const escapeExecutablePath = (pathName: string): string => {
    if (!/ /gu.test(pathName)) {
        return pathName
    }

    let isWindowsPath = /[a-zA-Z]:[\\/](?:[a-zA-Z0-9]+[\\/])*([a-zA-Z0-9]+)/gu.test(pathName)

    if (!/[\\/]/gu.test(pathName)) {
        isWindowsPath = process.platform === "win32"
    }

    if (isWindowsPath) {
        // Windows path
        return pathName.replace(/(?<!`) /gu, "` ")
    }

    return pathName.replace(/(?<!\\) /gu, "\\ ")
}
