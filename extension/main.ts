import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
// @ts-ignore
import SparqlClient from 'sparql-http-client/ParsingClient.js'
// @ts-ignore
import rdf from 'rdf-ext'

export default class MyPlugin extends Plugin {

	async onload() {

		// @ts-ignore
		this.app.libs = {
			rdf:rdf,
			client:SparqlClient
		}
		// @ts-ignore
		console.log('prototype-11-extension libs',this.app.libs)

		this.addCommand({
			id: 'open-prototype-11-extension',
			name: 'prototype-11-extension',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
	}

	onunload() {

	}

}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}
