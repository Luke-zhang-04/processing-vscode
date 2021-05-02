import yaml from "@rollup/plugin-yaml"
import progress from "rollup-plugin-progress"
import resolve from "@rollup/plugin-node-resolve"
import {terser} from "rollup-plugin-terser"
import typescript from "@rollup/plugin-typescript"

const banner = `/**
 * processing-vscode - Processing Language Support for VSCode
 * @version 2.1.0
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
        sourcemap: process.env.NODE_ENV === "dev" ? "inline" : false,
    },
    plugins: [
        progress(),
        typescript(),
        yaml(),
        resolve(),
        process.env.NODE_ENV === "dev"
            ? undefined
            : terser({
                  format: {
                      comments: (_, {value}) =>
                          (/@preserve/.test(value) || !/processing-vscode/iu.test(value)) &&
                          /@preserve|li[cs]ense|copyright/iu.test(value),
                  },
              }),
    ],
}

export default config
