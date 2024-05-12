import { App, MarkdownView, Plugin, PluginSettingTab, Setting, loadMathJax } from 'obsidian';
import wypst from 'wypst';
import wasm from 'wypst/core/core_bg.wasm';

import 'katex/dist/katex.css';
import 'default.css';

interface WypstSettings {
	fallbackToLatexOnError: boolean
}

const DEFAULT_SETTINGS: Partial<WypstSettings> = {
	fallbackToLatexOnError: false,
};

export default class Wypst extends Plugin {
	settings: WypstSettings
	_tex2chtml: any;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new WypstSettingTab(this.app, this));

		await loadMathJax();

		if (!globalThis.MathJax) {
			throw new Error("MathJax failed to load.");
		}

		await wypst.init(wasm);

		const parser = new DOMParser();
		this._tex2chtml = globalThis.MathJax.tex2chtml;

		globalThis.MathJax.tex2chtml = (e, r) => {
			if (!hasLatexCommand(e)) {
				const renderSettings = {
					displayMode: r.display,
				}
				let renderedString = '';

				try {
					renderedString = wypst.renderToString(e, renderSettings);
				} catch (error) {
					if (this.settings.fallbackToLatexOnError) {
						return this._tex2chtml(e, r);
					}
					renderedString = `<span style="color: red;">${error}</span>`;
				}
				return parser.parseFromString(renderedString, "text/html").body.firstChild;
			} else {
				return this._tex2chtml(e, r);
			}
		};

		this.app.workspace.getActiveViewOfType(MarkdownView)?.previewMode.rerender(true);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	onunload() {
		globalThis.MathJax.tex2chtml = this._tex2chtml;
		this.app.workspace.getActiveViewOfType(MarkdownView)?.previewMode.rerender(true);
	}
}

export class WypstSettingTab extends PluginSettingTab {
	plugin: Wypst;

	constructor(app: App, plugin: Wypst) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Fallback to LaTeX on error")
			.setDesc("Always fallback to LaTeX when Wypst fails to render an expression (experimental)")
			.addToggle(toggle => {
				toggle
					.setValue(this.plugin.settings.fallbackToLatexOnError)
					.onChange(async value => {
						this.plugin.settings.fallbackToLatexOnError = value;
						await this.plugin.saveSettings();
					})
			})
	}
}

function hasLatexCommand(expr: string) {
	const regex = /\\\S/;
	return regex.test(expr);
}
