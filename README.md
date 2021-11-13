<img width="25%" src="./images/icon.png" alt="icon"/>

# Processing for Visual Studio Code

[![Marketplace Version](https://vsmarketplacebadge.apphb.com/version/Luke-zhang-04.processing-vscode.svg?style=for-the-badge&logo=visual-studio-code&logoColor=007ACC&color=007ACC&labelColor=083254)](https://marketplace.visualstudio.com/items?itemName=Luke-zhang-04.processing-vscode)

[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/Luke-zhang-04.processing-vscode.svg?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=Luke-zhang-04.processing-vscode)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-star/Luke-zhang-04.processing-vscode.svg?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=Luke-zhang-04.processing-vscode)
[![.github/workflows/CI.yml](https://img.shields.io/github/workflow/status/Luke-zhang-04/processing-vscode/Node.js%20CI?label=CI&logo=github&style=flat-square)](https://github.com/Luke-zhang-04/processing-vscode/actions)
[![License](https://img.shields.io/github/license/Luke-zhang-04/processing-vscode?style=flat-square)](./LICENSE)
![Maintained?](https://img.shields.io/maintenance/yes/2021?style=flat-square)
[![Vulnerabilities](https://snyk.io/test/github/Luke-zhang-04/processing-vscode/badge.svg?style=flat-square)](https://snyk.io/test/github/Luke-zhang-04/processing-vscode)

Note on Processing 4: I'm not sure how this extension will handle Processing 4. I will wait for it to be out of beta and fix the extension if needed.

## Contents

-   [What this extension is](#what-this-extension-is)
-   [What this extension isn't](#what-this-extension-isnt)
-   [Why the fork?](#why-the-fork)
-   [Screenshots](#screenshots)
-   [Feature list](#feature-list)
    -   [Syntax Highlighting](#syntax-highlighting)
    -   [Snippets](#snippets)
    -   [Documentation on Hover](#documentation-on-hover)
    -   [Commands](#commands)
-   [Processing Python](#processing-python)
-   [Credits](#credits)

## What this extension is

This is a [fork of a Visual Studio Code extension created by Tobiah Zarlez](https://github.com/TobiahZ/processing-vscode) to add [Processing](https://processing.org/) language support, with added documentation on hover, diagnostics, and more.

## What this extension isn't

-   This extension does not allow you to debug Java or Processing projects.
-   This is **NOT a language server**, and hence cannot provide the features a language server can. There simply is not enough demand for a Processing language server, and that type of thing is definitely out of the scope of my abilities. Language servers take entire teams from big companies such as Microsoft to make.
    -   This extension cannot provide IntelliSense, for example

## Why the fork?

The [original extension](https://github.com/TobiahZ/processing-vscode) was missing some features that I wanted and it seemed as if the repo was no longer being maintained. So, forked the extension and changed some things.

-   Better syntax highlighting (from [Red Hat Java](https://github.com/redhat-developer/vscode-java/blob/master/syntaxes/java.tmLanguage.json))
-   Documentation on hover (via Regex)
-   A run button (both Processing Java and Processing Python)
-   Simple diagnostics (via the processing-java CLI, which can be extremely slow, and is disabled by default)
-   Strings are auto closing and surrounding (didn't work in the old extension)

See the [CHANGELOG](https://github.com/Luke-zhang-04/processing-vscode/blob/main/CHANGELOG.md) for all changes

## Screenshots

![Hover](https://raw.githubusercontent.com/Luke-zhang-04/processing-vscode/main/media/hover-1.png)

<details>
<summary>More Screenshots</summary>

![Hover](https://raw.githubusercontent.com/Luke-zhang-04/processing-vscode/main/media/hover-2.png)
![Error](https://raw.githubusercontent.com/Luke-zhang-04/processing-vscode/main/media/error.png)

</details>

## Feature list

### Syntax highlighting

Open any .pde file, or choose "Processing" from the drop down menu in the bottom right corner. Syntax highlighting is from [Red Hat's Java extension](https://github.com/redhat-developer/vscode-java/blob/master/syntaxes/java.tmLanguage.json).

### Snippets

Once the language has been set, you will see code snippets pop up automatically as you type!

### Documentation on hover

When you hover over a function such as `square`, documentation for this function will appear! Documentation is scraped directly from the [Processing reference page](https://processing.org/reference/), so anything missing from there will be missing here too.

### Commands

Installing this extension will add the following commands to your command pallette (`CTRL+SHIFT+P`, or opened by `View -> Command Pallette`). These commands can be selected and run from there, to complete the corresponding tasks.

-   Open Extension Documentation
    -   Opens this documentation.
-   Open Documentation for Selection
    -   Use the pallet command "Processing: Open Documentation for Selection" to open the processing documentation for the current selection.
    -   By default uses processing.org's documentation. Can change to p5js's if preferred using the `processing.docs` setting.
-   Run
    -   Runs the current Processing project (from current working directory). Will automatically detect if the project is Processing Java or Python
-   RunJava
    -   Runs the current Processing Java project (from CWD)
-   RunPy
    -   Runs the current Processing Python project (from CWD)
-   Search Processing Website
    -   Use the pallet command "Processing: Search Processing Website" to quickly search whatever you want on the processing website.
    -   By default uses Google for search. Can change to DuckDuckGo if preferred using the `processing.search` setting.

## Processing Python

This extension attempts to make Processing with Python easier to use. Follow these steps:

1. Download the [processing-python library](https://py.processing.org/tutorials/command-line/#requirements) for your operating system
    - Take note of the location of this file. For example, I might store mine in `~/processing.py-linux64/processing.py-3056-linux64/processing-py.jar`
2. Download the proper [Java version](https://py.processing.org/tutorials/command-line/#requirements) for your operating system
    - Follow the steps in the [Processing docs](https://py.processing.org/tutorials/command-line/#requirements)
3. Configure the extension
    - Change the following configuration options
        - `processing.py.jarPath`: the path to your `processing-py.jar` file. Preferably, this is an absolute path. In this example, it will be `~/processing.py-linux64/processing.py-3056-linux64/processing-py.jar`
        - `processing.py.javaPath`: the path to your `java` executable. For example, `/usr/bin/java`
        - Make sure `processing.py.isEnabled` is set to `true` (true by default)
4. Downloads stub definitions (optional)
    - Definitions can be found [here](https://github.com/Abdulla060/Processing.py-intellisense/blob/master/lib/Processing3.pyi)
    - After than, follow the imports in [this example](https://github.com/Abdulla060/Processing.py-intellisense/blob/master/Example.py)

## Credits

-   Snippets are based on the [Processing Sublime Text plugin](https://github.com/b-g/processing-sublime).
-   Syntax highlighting is based on the [Red Hat VSCode-Java extension grammar](https://github.com/redhat-developer/vscode-java/blob/master/syntaxes/java.tmLanguage.json)
-   Thanks to [Tobiah Zarlez](https://github.com/TobiahZ) for making the [original extension](https://github.com/TobiahZ/processing-vscode)

## Development

-   Run `yarn vsce package`
-   Run `code --install-extension processing-vscode-<VERSION>.vsix`
