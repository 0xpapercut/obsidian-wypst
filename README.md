# obsidian-wypst
High quality rendering of Typst in Obsidian, powered by wypst.

## Usage
This plugin overrides regular math blocks (`$<...>$` and `$$<...>$$`), so that they're rendered as Typst math.

## Compatibility
To maximize compatibility with LaTeX documents, the rendering backend switches to KaTeX when certain structures like `\begin{environment}<...>\end{environment}` or `\<some-symbol>` are encoutered, or if otherwise the Typst rendering fails.

## Issues
The rendering is not slow, but certain documents can take some time to open. I hope to investigate this issue in the future.

I welcome everyone who encounters a problem to open a issue on [0xpapercut/obsidian-wypst](https://github.com/0xpapercut/obsidian-wypst/issues/new).
