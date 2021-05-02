# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2021-05-02

### Added

-   feat: add `runPathQuote` option

### Changed

-   ! diagnostics are opt-out by default

### Fixed

-   fix: quote windows path names

## [2.0.6] - 2021-03-19

### Fixed

-   Make valid project names case insensitive

## [2.0.5] - 2020-03-19

### Fixed

-   Handle paths with spaces better

## [2.0.4] - 2020-03-18

### Fixed

-   Added quotes around run command to allow for whitespaced paths [#1](https://github.com/Luke-zhang-04/processing-vscode/pull/1)

## [2.0.3] - 2021-03-01

Even more changes to README

## [2.0.2] - 2021-03-01

More changes to README

## [2.0.1] - 2021-03-01

Only some changes to README and CI

### Changed

-   made the run button a lighter green

## [2.0.0] - 2021-03-01

### Added

-   feat: add documentation on hover for Processing Buildtins
-   feat: add diagnostics from the `processing-java` CLI
-   feat: add a run button to the editor menu
-   feat: add quotes to `autoClosingPairs` and `surroundingPairs`

### Changed

-   changed configuration `processing.path` to `processing.processingPath`
-   changed language configuration
-   changed the langauge grammar to Red Hat's [Java Grammar](https://github.com/redhat-developer/vscode-java/blob/master/syntaxes/java.tmLanguage.json)

### Removed

-   removed the task file feature in favour of a run button

## [1.4.6] - 2020-09-03

### Fixed

-   Updated markdown files

## [1.4.5] - 2020-09-03

### Fixed

-   Updated packages

### Changed

-   Using GitHub Actions instead of Travis

## [1.4.4] - 2020-08-25

### Added

Can now use DuckDuckGo or Google to search. Thanks to [@atnbueno](https://github.com/atnbueno)

## [1.4.3] - 2020-08-25

### Fixed

Merged in bugfix PRs from [@hysysk](https://github.com/hysysk) and [@atnbueno](https://github.com/atnbueno)

Updated dependencies

## [1.4.1] - 2019-12-23

### Fixed

Improved snippets.json thanks to work from [@jerrylususu](https://github.com/jerrylususu)

Fixed Windows on Bash path issue thanks to [@micuat](https://github.com/micuat)

## [1.4.0] - 2019-08-30

### Fixed

Updated tests from latest template to fix automatic builds.

### Added

Users can now choose between processing.org's documentation and p5js

Thanks to [@brianmcfadden](https://github.com/brianmcfadden)

## [1.3.1] - 2019-06-05

### Fixed

-   Updated NPM packages

## [1.3] - 2019-02-06

### Removed

-   Removed the opn requirement, using new internal open external API

### Fixed

-   Updated package.json requirements

## [1.2.2] - 2018-07-25

### Added

-   Added path setting

## [1.1.0] - 2018-05-09

### Added

-   Added documentation search

### Fixed

-   Changed extension namespace to processing (from "extension")

## [1.0.0] - 2018-05-09

### Added

-   Added Changelog
-   Support for multi root workplaces

### Fixed

-   Updated dependencies and deploy scripts
