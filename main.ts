import { Plugin, loadMathJax } from 'obsidian';
import katex from 'katex';
import wypst from 'wypst';
import wasm from 'wypst/core/core_bg.wasm';

import 'katex/dist/katex.css';
import 'default.css';

export default class Wypst extends Plugin {
	_tex2chtml;

	async onload() {
		await loadMathJax();

		if (!global.MathJax) {
			throw new Error("MathJax failed to load.");
		}

		await wypst.init(wasm);

		const parser = new DOMParser();
		this._tex2chtml = global.MathJax.tex2chtml;

		global.MathJax.tex2chtml = (e, r) => {
			let renderedString = '';
			const renderSettings = {
				throwOnError: false,
				displayMode: r.display,
			}
			if (!hasLatexCommand(e)) {
				try {
					renderedString = wypst.renderToString(e, renderSettings);
				} catch (error) {
					renderedString = `<span style="color: red;">${error}</span>`;
				}
			} else {
				renderedString = katex.renderToString(e, renderSettings);
			}

			return parser.parseFromString(renderedString, "text/html").body.firstChild;
		}
	}

	onunload() {
		global.MathJax.tex2chtml = this._tex2chtml;
	}
}

function hasLatexCommand(expr: string) {
	const regex = /\\\S/;
	return regex.test(expr);
}
