# Wypst
High quality rendering of [Typst](https://github.com/typst/typst) in Obsidian, powered by [wypst](https://github.com/0xpapercut/wypst).

## Usage
This plugin overrides regular math blocks (`$<...>$` and `$$<...>$$`), so that they're rendered as Typst math.

## Compatibility
To maximize compatibility with LaTeX documents, the rendering backend switches to KaTeX when certain structures like `\begin{environment}<...>\end{environment}` or `\<some-symbol>` are encoutered.

For example, `$pi$` will be rendered using Typst, whereas `$\pi$` will be rendered as regular LaTeX; for this specific case the rendering quality will be identical.

## Issues
I welcome everyone who encounters a problem to open an issue on [0xpapercut/obsidian-wypst](https://github.com/0xpapercut/obsidian-wypst/issues/new).
