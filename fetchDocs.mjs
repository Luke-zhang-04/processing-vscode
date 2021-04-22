#!/bin/node

/**
 * @file gets Documentation from https://processing.org/reference and dumps it into
 *   `src/documentation-data.json` with some bootleg webscraping
 */

import {JSDOM} from "jsdom"
import fetch from "node-fetch"
import {promises as fs} from "fs"

const docsUrl = "https://processing.org/reference"

// Processing global variables
const variables = [
    "focused",
    "frameCount",
    "height",
    "width",
    "pixelHeight",
    "pixelWidth",
    "mouseButton",
    "mouseX",
    "mouseY",
    "pmouseX",
    "pmouseY",
    "key",
    "keyCode",
    "keyPressed",
    "HALF_PI",
    "PI",
    "QUARTER_PI",
    "TAU",
    "TWO_PI",
]

const constants = ["HALF_PI.html", "PI.html", "QUARTER_PI.html", "TAU.html", "TWO_PI.html"]

// Processing classes
const classes = [
    "Array",
    "ArrayList",
    "FloatDict",
    "FloatList",
    "HashMap",
    "IntDict",
    "IntList",
    "JSONArray",
    "JSONObject",
    "Object",
    "String",
    "StringDict",
    "StringList",
    "Table",
    "TableRow",
    "XML",
    "PShape",
    "PImage",
    "PGraphics",
    "PShader",
    "PFont",
    "PVector",
]

/**
 * Gets all the links to Processing builtins
 */
const getDocLinks = async () => {
    const response = await fetch(docsUrl)

    if (response.status !== 200) {
        console.log(`Response for all links returned status ${response.status}.`)
        console.log(response)

        return
    }

    const {window} = new JSDOM(await response.text()) // Fetch docs and parse as document
    const {document} = window
    const references = Array.from(document.querySelectorAll("div.category a")) // All reference items

    return {
        functionLinks: references // Function doc links
            .filter(({innerHTML}) => /[A-z]\(\)/u.test(innerHTML))
            .map((item) => item.getAttribute("href")),
        variableLinks: references // Variable doc links
            .filter(({innerHTML}) => variables.includes(innerHTML))
            .map((item) => item.getAttribute("href")),
        classLinks: references // Class doc links
            .filter(({innerHTML}) => classes.includes(innerHTML))
            .map((item) => item.getAttribute("href")),
    }
}

const escapeHTML = (html) =>
    html
        .replace(/<(\/)?(b|pre)>/gu, "`")
        .replace(/<br(\/)?>/gu, "")
        .replace(/<[^>]*>/gu, "")
        .replace(/&lt;/gu, "<")
        .replace(/&gt;/gu, ">")

/**
 * Gets the documentation for a single link
 *
 * @param {string} link - Link to get doc from
 * @returns {Promise<import("./src/documentation").DocumentationVariable>}
 */
const documentVariable = async (link) => {
    const documentation = {
        docUrl: `${docsUrl}/${link}`,
        type: constants.includes(link) ? "const" : "var",
    }

    const response = await fetch(`${docsUrl}/${link}`)

    if (!response.ok) {
        console.log(`Response for ${link} returned status ${response.status}.`)
        console.log(response)

        return
    }

    const {window} = new JSDOM(await response.text()) // Parse webpage
    const {document} = window

    for (const item of Array.from(document.querySelectorAll(".content table tr"))) {
        const header = item.querySelector("th")

        if (!header) {
            continue
        }

        const {innerHTML} = header // Get the header for each table item

        const property = (() => {
            if (["Description", "Examples", "Name"].includes(innerHTML)) {
                return innerHTML.toLowerCase()
            }
        })()

        if (property) {
            if (property === "description") {
                const description = escapeHTML(item.querySelector("td").innerHTML).replace(
                    /\\n/gu,
                    "\n\n",
                )

                documentation.description =
                    description.length > 1000 ? description.slice(0, 1000) + ". . ." : description
            } else if (property === "examples") {
                documentation[property] = escapeHTML(item.querySelector("td").innerHTML).replace(
                    /`/giu,
                    "",
                )
            } else {
                documentation[property] = escapeHTML(item.querySelector("td").innerHTML)
            }
        }
    }

    return documentation
}

/**
 * Gets the documentation for a single link
 *
 * @param {string} link - Link to get doc from
 * @returns {Promise<import("./src/documentation").DocumentationFunction>}
 */
const documentFunction = async (link) => {
    const documentation = {
        docUrl: `${docsUrl}/${link}`,
        parameters: {},
        type: "function",
    }

    const response = await fetch(`${docsUrl}/${link}`)

    if (!response.ok) {
        console.log(`Response for ${link} returned status ${response.status}.`)
        console.log(response)

        return
    }

    const {window} = new JSDOM(await response.text())
    const {document} = window

    for (const item of Array.from(document.querySelectorAll(".content table tr"))) {
        const header = item.querySelector("th")

        if (!header) {
            continue
        }

        const {innerHTML} = header

        const property = (() => {
            if (["Description", "Syntax", "Returns", "Parameters", "Name"].includes(innerHTML)) {
                return innerHTML.toLowerCase()
            }
        })()

        if (property) {
            if (property === "parameters") {
                Array.from(item.querySelectorAll("td table tr")).forEach((item) => {
                    documentation.parameters[item.querySelector("th").innerHTML] = escapeHTML(
                        item.querySelector("td").innerHTML,
                    )
                })
            } else if (property === "syntax") {
                documentation.syntax = escapeHTML(item.querySelector("td").innerHTML).replace(
                    /`/gu,
                    "",
                )
            } else if (property === "description") {
                const description = escapeHTML(item.querySelector("td").innerHTML).replace(
                    /\\n/gu,
                    "\n\n",
                )

                documentation.description =
                    description.length > 1000 ? description.slice(0, 1000) + ". . ." : description
            } else {
                documentation[property] = escapeHTML(item.querySelector("td").innerHTML)
            }
        }
    }

    return documentation
}

/**
 * Gets the documentation for a single link
 *
 * @param {string} link - Link to get doc from
 * @returns {Promise<import("./src/documentation").DocumentationClass>}
 */
const documentClass = async (link) => {
    const documentation = {
        docUrl: `${docsUrl}/${link}`,
        parameters: {},
        methods: {},
        fields: {},
        type: "class",
    }

    const response = await fetch(`${docsUrl}/${link}`)

    if (!response.ok) {
        // If response wasn't ok, return
        console.log(`Response for ${link} returned status ${response.status}.`)
        console.log(response)

        return
    }

    const {window} = new JSDOM(await response.text()) // Parse the page
    const {document} = window

    for (const item of Array.from(document.querySelectorAll(".content table tr"))) {
        const header = item.querySelector("th")

        if (!header) {
            continue
        }

        const {innerHTML} = header

        const property = (() => {
            if (["Description", "Constructor", "Parameters", "Name"].includes(innerHTML)) {
                return innerHTML.toLowerCase()
            }
        })()

        if (property) {
            if (property === "parameters") {
                Array.from(item.querySelectorAll("td table tr")).forEach((item) => {
                    documentation.parameters[item.querySelector("th").innerHTML] = escapeHTML(
                        item.querySelector("td").innerHTML,
                    )
                })
            } else if (property === "constructor") {
                documentation.syntax = escapeHTML(item.querySelector("td").innerHTML).replace(
                    /`/gu,
                    "",
                )
            } else if (property === "description") {
                const description = escapeHTML(item.querySelector("td").innerHTML).replace(
                    /\\n/gu,
                    "\n\n",
                )

                documentation.description =
                    description.length > 1000 ? description.slice(0, 1000) + ". . ." : description
            } else {
                documentation[property] = escapeHTML(item.querySelector("td").innerHTML)
            }
        }
    }

    return documentation
}

/**
 * Gets the documentation for the links in `links`
 *
 * @param {{
 *     functionLinks: string[]
 *     variableLinks: string[]
 *     classLinks: string[]
 * }} links
 *   - Links go get documenttion from
 */
const documentLinks = async ({classLinks, functionLinks, variableLinks}) => {
    /**
     * All documentation (final object dumped to JSON)
     *
     * @type {import("./src/documentation").Documentation}
     */
    const documentation = {}

    const fetchPromises = [] // Get documentation asynchronously

    for (const link of functionLinks) {
        // Document functions
        const job = (async () => {
            const doc = await documentFunction(link)

            if (doc) {
                documentation[doc.name.replace(/\(\)/gu, "")] = {
                    ...doc,
                    name: undefined,
                }
            }
        })()

        fetchPromises.push(job)
    }

    for (const link of classLinks) {
        // Document classes
        const job = (async () => {
            const doc = await documentClass(link)

            if (doc) {
                documentation[doc.name.replace(/\(\)/gu, "")] = {
                    ...doc,
                    name: undefined,
                }
            }
        })()

        fetchPromises.push(job)
    }

    for (const link of variableLinks) {
        // Document variables
        const job = (async () => {
            const doc = await documentVariable(link)

            if (doc) {
                documentation[doc.name.replace(/\(\)/gu, "")] = {
                    ...doc,
                    name: undefined,
                }
            }
        })()

        fetchPromises.push(job)
    }

    await Promise.all(fetchPromises)

    return documentation
}

const sortJsonObject = (obj) => {
    const sortedObj = {}

    for (const key of Object.keys(obj).sort()) {
        sortedObj[key] = obj[key]
    }

    return sortedObj
}

;(async () => {
    const links = await getDocLinks()

    if (!links) {
        return
    }

    console.log(
        `Got doc links for ${
            links.functionLinks.length + links.classLinks.length + links.variableLinks.length
        } items`,
    )

    const docs = await documentLinks(links)

    await fs.writeFile(
        "./src/documentation-data.yml",
        `# THIS IS AN AUTOGENERATED FILE; DO NOT EDIT DIRECTLY\n\n${JSON.stringify(
            sortJsonObject(docs),
            null,
            2,
        )}`,
        "utf8",
    )
})()
