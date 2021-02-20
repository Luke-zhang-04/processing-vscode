import json from "@rollup/plugin-json"
import progress from "rollup-plugin-progress"
import resolve from "@rollup/plugin-node-resolve"
import {terser} from "rollup-plugin-terser"
import typescript from "@rollup/plugin-typescript"

const banner = `/**
 * processing-vscode - Processing Language Support for VSCode
 * @version 1.0.0
 * @copyright (C) 2016 - 2020 Tobiah Zarlez, 2021 Luke Zhang
 * @preserve
 */
`

/**
 * @type {import("rollup").RollupOptions}
 */
const config = {
    input: "src/index.ts",
    output: {
        file: "./processing-vscode.js",
        format: "cjs",
        banner,
        inlineDynamicImports: true,
    },
    plugins: [
        progress(),
        typescript(),
        json(),
        resolve({
            resolveOnly: [/^\.{0,2}\/|tslib/],
        }),
        terser({
            format: {
                comments: (_, {value}) => (
                    // (!(/Luke Zhang/ui).test(value) || (/@preserve/ui).test(value)) &&
                    (/@preserve|li[cs]ense|copyright/ui).test(value)
                ),
            }
        }),
    ]
}

export default config
