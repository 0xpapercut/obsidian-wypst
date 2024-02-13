# Wypst
High quality rendering of [Typst](https://github.com/typst/typst) in Obsidian, powered by [wypst](https://github.com/0xpapercut/wypst).

## Usage
This plugin overrides regular math blocks (`$<...>$` and `$$<...>$$`), so that they're rendered as Typst math.

## Compatibility
To maximize compatibility with LaTeX math blocks, the rendering backend switches to MathJax when certain structures like `\begin{environment}<...>\end{environment}` or `\<some-symbol>` are encoutered.

For example, `$pi$` will be rendered using Typst, whereas `$\pi$` will be rendered as regular LaTeX.

In general, expressions in Typst and LaTeX, if equivalent, should render to _exactly_ the same output. If this is not the case, you can report it as an issue.

## Issues
I welcome everyone who encounters a problem to open an issue on [0xpapercut/obsidian-wypst](https://github.com/0xpapercut/obsidian-wypst/issues/new).
