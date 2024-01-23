import { Plugin, loadMathJax } from 'obsidian';
import katex from 'katex';
import wypst from 'wypst';

export default class Wypst extends Plugin {
	_tex2chtml;

	wasmPath = this.app.vault.configDir + '/plugins/obsidian-wypst/core_bg.wasm';

	async onload() {
		await loadMathJax();

		if (!global.MathJax) {
			console.log("MathJax failed to load.")
		} else {
			console.log("MathJax loaded.")
		}

		const blob = new Blob ([await this.app.vault.adapter.readBinary(this.wasmPath)], { type: 'application/wasm' });
		const url = URL.createObjectURL(blob);
		await wypst.init(url);

		const parser = new DOMParser();
		this._tex2chtml = global.MathJax.tex2chtml;

		global.MathJax.tex2chtml = (e, r) => {
			const renderSettings = {
				throwOnError: false,
				displayMode: r.display,
			}

			const renderedString = katex.renderToString(e, renderSettings);
			return parser.parseFromString(renderedString, "text/html").body.firstChild;
		}
	}

	onunload() {
		global.MathJax.tex2chtml = this._tex2chtml;
	}
}
