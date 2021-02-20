#!/bin/node

/**
 * @file fetched documentation from https://processing.org/reference and dumps it into src/documentation-data.json
 */

import fetch from "node-fetch"
import {promises as fs} from "fs"
import {JSDOM} from "jsdom"

const docsUrl = "https://processing.org/reference"

/**
 * Gets all the links to Processing builtins
 */
const getDocLinks = async () => {
    const {window} = new JSDOM(await (await fetch(docsUrl)).text()) // Fetch docs and parse as document
    const {document} = window

    return Array.from(document.querySelectorAll("div.category a")) // Get all the build in function links
        .filter(({innerHTML}) => /[A-z]\(\)/u.test(innerHTML))
        .map((item) => item.getAttribute("href"))
}

const escapeHTML = (html) =>
    html
        .replace(/<(\/)?(b|pre)>/gu, "`")
        .replace(/<br(\/)?>/gu, "")
        .replace(/<[^>]*>/gu, "")

/**
 * Gets the documentation for a single link
 * @param {string} link - link to get doc from
 * @returns {{
 *  description: string,
 *  syntax: string,
 *  parameters: {[key: string]: string},
 *  returns: string,
 *  docUrl: string,
 *  name: string,
 * }}
 */
const documentLink = async (link) => {
    const documentation = {
        docUrl: `${docsUrl}/${link}`,
        parameters: {},
    }

    const {window} = new JSDOM(await (await fetch(`${docsUrl}/${link}`)).text())
    const {document} = window

    Array.from(document.querySelectorAll(".content table tr")) // Go through each table item and add documentation
        .forEach((item) => {
            const header = item.querySelector("th")

            if (!header) {
                return
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
                    documentation.description = escapeHTML(
                        item.querySelector("td").innerHTML,
                    ).replace(/\\n/gu, "\n\n")
                } else {
                    documentation[property] = escapeHTML(item.querySelector("td").innerHTML)
                }
            }
        })

    return documentation
}

/**
 * Gets the documentation for the links in `links`
 * @param {string[]} links - links go get documenttion from
 */
const documentLinks = async (links) => {
    /**
     * @type {{[key: string]: {
     *  description: string,
     *  syntax: string,
     *  parameters: {[key: string]: string},
     *  returns: string,
     *  docUrl: string,
     * }}}
     */
    const documentation = {}

    const fetchPromises = []

    for (const link of links) {
        const job = (async () => {
            const doc = await documentLink(link)

            documentation[doc.name.replace(/\(\)/gu, "")] = {
                ...doc,
                name: undefined,
            }
        })()

        fetchPromises.push(job)
    }

    await Promise.all(fetchPromises)

    return documentation
}

;(async () => {
    const links = await getDocLinks()
    const docs = await documentLinks(links)

    await fs.writeFile("./src/documentation-data.json", JSON.stringify(docs, null, 2), "utf8")
})()
