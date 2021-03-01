# Processing for Visual Studio Code

## What this extension is

This is a fork of a Visual Studio Code extension created by Tobiah Zarlez to add Processing language support, with added documentation on hover, diagnostics, and more.

Note: You should probably uninstall the old extension as the syntax highlighting will conflict

## What this extension isn't

This extension does not allow you to debug Java or Processing projects. It also doesn't include any sort of intellisense.

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

## Command: Search Processing Website

Use the pallet command "Processing: Search Processing Website" to quickly search whatever you want on the processing website.

By default uses Google for search. Can change to DuckDuckGo if preferred using the `processing.search` setting.

## Credits

Snippets are based on the [Processing Sublime Text plugin](https://github.com/b-g/processing-sublime).
Syntax highlighting is based on the [Red Hat VSCode-Java extension grammar](https://github.com/redhat-developer/vscode-java/blob/master/syntaxes/java.tmLanguage.json)
