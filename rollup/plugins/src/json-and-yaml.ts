/**
 * @license MIT
 * @file Improved Version of @rollup/plugin-json and @rollup/plugin-yaml that combines the two and
 *   provides the option for JSON.stringify()
 * @copyright (c) 2019 RollupJS Plugin Contributors
 *  (https://github.com/rollup/plugins/graphs/contributors), 2021 Luke Zhang
 * @see {@link https://github.com/rollup/plugins/tree/master/packages/json}
 * @see {@link https://github.com/rollup/plugins/tree/master/packages/yaml}
 */

import {FilterPattern, createFilter, dataToEsm} from "@rollup/pluginutils"
import yaml from "js-yaml"
import type {PluginFunc} from "./types"

type ValidYamlType =
    | number
    | string
    | boolean
    | null
    | undefined
    | {[key: string]: ValidYamlType}
    | ValidYamlType[]

type RollupJsonOptions = {
    /**
     * All JSON and YAML files will be parsed by default, but you can also specifically include files
     *
     * @default ["**‍/*.json", "**‍/*.y(a)?ml"]
     */
    include?: FilterPattern
    /**
     * All JSON and YAML files will be parsed by default, but you can also specifically exclude files
     *
     * @default
     */
    exclude?: FilterPattern
    /**
     * For tree-shaking, properties will be declared as variables, using either `var` or `const`.
     *
     * @default true
     */
    preferConst?: boolean
    /**
     * Specify indentation for the generated default export
     *
     * @default
     */
    indent?: string
    /**
     * Ignores indent and generates the smallest code
     *
     * @default false
     */
    compact?: boolean
    /**
     * Generate a named export for every property of the JSON object
     *
     * @default true
     */
    namedExports?: boolean
    /**
     * Character for when json should be stringified and then parsed at runtime
     *
     * @default 14 * 1024 (14kb)
     * @see {@link https://v8.dev/blog/cost-of-javascript-2019#json}
     */
    stringifyLimit?: number
    /**
     * A function which can optionally mutate parsed YAML. The function should return the mutated
     * `object`, or `undefined` which will make no changes to the parsed YAML.
     *
     * @default undefined
     */
    transform?: (data: ValidYamlType, filePath: string) => ValidYamlType | undefined
    /**
     * - If `single`, specifies that the target YAML documents contain only one document in the target file(s).
     * - If more than one [document stream](https://yaml.org/spec/1.2/spec.html#id2801681) exists in
     *   the target YAML file(s), set `documentMode: 'multi'`.
     *
     * @default "single"
     */
    documentMode?: "single" | "multi"
}

const json: PluginFunc<RollupJsonOptions> = ({
    include = ["**/*.y(a)?ml", "**/*.json"],
    exclude,
    preferConst = true,
    indent = "  ",
    compact = false,
    namedExports = true,
    stringifyLimit = 14 * 1024,
    transform,
    documentMode = "single",
} = {}) => {
    const filter = createFilter(include, exclude)

    let loadMethod = (documentMode === "multi" ? yaml.loadAll : yaml.load) as (
        str: string,
        iterator?: (doc: any) => void,
        opts?: yaml.LoadOptions,
    ) => ValidYamlType

    const plugin: ReturnType<PluginFunc<RollupJsonOptions>> = {
        name: "json/yaml",
        transform(code, id) {
            if (!filter(id)) {
                return null
            }

            try {
                const parsed = transform?.(loadMethod(code), id) ?? loadMethod(code)
                const stringified = JSON.stringify(parsed, null, 0)

                return {
                    code:
                        stringified.length > stringifyLimit
                            ? `export default JSON.parse(${JSON.stringify(stringified)})`
                            : dataToEsm(parsed, {
                                  preferConst,
                                  compact,
                                  namedExports,
                                  indent,
                              }),
                    map: {mappings: ""},
                }
            } catch (err) {
                const message = `Could not parse JSON file: ${
                    err instanceof Error ? err.toString() : JSON.stringify(err)
                }`

                this.error({message, id})
            }
        },
    }

    return plugin
}

export default json
