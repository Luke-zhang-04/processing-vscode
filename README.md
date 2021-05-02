# Processing for Visual Studio Code

[![.github/workflows/CI.yml](https://img.shields.io/github/workflow/status/Luke-zhang-04/processing-vscode/Node.js%20CI?label=CI&logo=github)](https://github.com/Luke-zhang-04/processing-vscode/actions)

[![Marketplace Version](https://vsmarketplacebadge.apphb.com/version/Luke-zhang-04.processing-vscode.svg)](https://marketplace.visualstudio.com/items?itemName=Luke-zhang-04.processing-vscode)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/Luke-zhang-04.processing-vscode.svg)](https://marketplace.visualstudio.com/items?itemName=Luke-zhang-04.processing-vscode)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-star/Luke-zhang-04.processing-vscode.svg)](https://marketplace.visualstudio.com/items?itemName=Luke-zhang-04.processing-vscode)

Jump to the [Feature List](#Feature-list)

## What this extension is

This is a fork of a Visual Studio Code extension created by Tobiah Zarlez to add Processing language support, with added documentation on hover, diagnostics, and more.

Note: You should probably uninstall the old extension as the syntax highlighting will conflict

## What this extension isn't

This extension does not allow you to debug Java or Processing projects. It also doesn't include any sort of intellisense.

## Why the fork?

The [original extension](https://github.com/TobiahZ/processing-vscode) was missing some features that I wanted and it seemed as if the repo was no longer being maintained. So, forked the extension and changed some things.

-   Better syntax highlighting (thanks to [Red Hat](https://github.com/redhat-developer/vscode-java/blob/master/syntaxes/java.tmLanguage.json))
-   Documentation on hover
-   A run button
-   Simple diagnostics
-   Strings are auto closing and surrounding

See the [CHANGELOG](https://github.com/Luke-zhang-04/processing-vscode/blob/main/CHANGELOG.md) for all changes

![Hover](https://raw.githubusercontent.com/Luke-zhang-04/processing-vscode/main/media/hover-1.png)
![Hover](https://raw.githubusercontent.com/Luke-zhang-04/processing-vscode/main/media/hover-2.png)
![Error](https://raw.githubusercontent.com/Luke-zhang-04/processing-vscode/main/media/error.png)

## Feature list

### Syntax highlighting

Open any .pde file, or choose "Processing" from the drop down menu in the bottom right corner.

### Snippets

Once the language has been set, you will see code snippets pop up automatically as you type!

### Documentation on hover

When you hover over a function such as `square`, documentation for this function will appear!

### Commands

Installing this extension will add the following commands to your command pallette (`CTRL+SHIFT+P`, or opened by `View -> Command Pallette`). These commands can be selected and run from there, to complete the corresponding tasks.

## Command: Open Extension Documentation

Opens this documentation.

## Command: Open Documentation for Selection

Use the pallet command "Processing: Open Documentation for Selection" to open the processing documentation for the current selection.

By default uses processing.org's documentation. Can change to p5js's if preferred using the `processing.docs` setting.

## Command: Run

Runs the current processing project (from current working directory). Also includes a run button in the editor menu

## Command: Search Processing Website

Use the pallet command "Processing: Search Processing Website" to quickly search whatever you want on the processing website.

By default uses Google for search. Can change to DuckDuckGo if preferred using the `processing.search` setting.

## Proper Hover, Intellisense, and Diagnostics

Problems with the current approach:

-   Hover works with word matching, so comments show documentation on hover
-   There's no intellsense, only the built in VSCode word matching
-   Diagnostics rely on processing-java, which makes it very slow, and also has no option to cache the build

Despite all these problems however, this extension probably will stay this way. Why? Because there isn't nearly enough demand to make a "proper" extension that popular languages such as Python do. Making an extension like this would require me to write a parser and generate an AST, far too much work for a language that I won't really be using outside of my class, and way outside of my abilities. If someone really wants to do this, they can go ahead, I guess.

## Credits

Snippets are based on the [Processing Sublime Text plugin](https://github.com/b-g/processing-sublime).
Syntax highlighting is based on the [Red Hat VSCode-Java extension grammar](https://github.com/redhat-developer/vscode-java/blob/master/syntaxes/java.tmLanguage.json)
