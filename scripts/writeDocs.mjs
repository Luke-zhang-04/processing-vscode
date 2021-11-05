#!/bin/node

/**
 * @file gets Documentation from https://processing.org/reference and dumps it into
 *   `src/documentation-data.json` with some bootleg webscraping
 */

import {dirname} from "path"
import {fileURLToPath} from "url"
import {promises as fs} from "fs"
import yaml from "yaml"
import getDocs from "./helpers/fetchDocs.mjs"

const __dirname = dirname(fileURLToPath(import.meta.url))

const docs = await getDocs()

await fs.writeFile(
    `${__dirname}/../data/documentation-data.yml`,
    `# THIS IS AN AUTOGENERATED FILE; DO NOT EDIT DIRECTLY\n\n${yaml.stringify(docs, {
        sortMapEntries: true,
    })}`,
    "utf8",
)