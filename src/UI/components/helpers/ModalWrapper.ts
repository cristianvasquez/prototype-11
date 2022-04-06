import {App, Modal} from "obsidian";

export class ModalWrapper extends Modal {
    private readonly view;

    constructor(app: App, view: any) {
        super(app);
        this.view = view
    }

    onOpen() {
        const {contentEl} = this;
        this.view.mount(contentEl)
    }

    onClose() {
        const {contentEl} = this;
        this.view.unmount(contentEl)
    }
}