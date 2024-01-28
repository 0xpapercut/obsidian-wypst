import { Plugin, loadMathJax } from 'obsidian';
import katex from 'katex';
import wypst from 'wypst';

export default class Wypst extends Plugin {
	_tex2chtml: any;
	wasmPath = this.app.vault.configDir + '/plugins/obsidian-wypst/core_bg.wasm';

	async onload() {
		await loadMathJax();

		if (!global.MathJax) {
			throw new Error("MathJax failed to load.");
		}

		const wasm = await this.app.vault.adapter.readBinary(this.wasmPath);
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
				renderedString = wypst.renderToString(e, renderSettings);
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
