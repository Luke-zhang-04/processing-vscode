import yaml from "@rollup/plugin-yaml"
import progress from "rollup-plugin-progress"
import resolve from "@rollup/plugin-node-resolve"
import {terser} from "rollup-plugin-terser"
import typescript from "@rollup/plugin-typescript"

const banner = `/**
 * Processing-vscode - Processing Language Support for VSCode
 * https://github.com/Luke-zhang-04/processing-vscode
 *
 * @license MIT
 * @version 2.2.0
 * @preserve
 * @copyright (C) 2016 - 2020 Tobiah Zarlez, 2021 Luke Zhang
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
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
        resolve({
            resolveOnly: [/^(?!vscode)$/],
        }),
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
