import {App, Modal} from "obsidian";

export class RDFModal extends Modal {
    private readonly text: string;

    constructor(app: App, text: string) {
        super(app);
        this.text = text
    }

    onOpen() {
        const {contentEl} = this;
        contentEl.setText(this.text);
    }

    onClose() {
        const {contentEl} = this;
        contentEl.empty();
    }
}