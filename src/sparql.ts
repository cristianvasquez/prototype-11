import {MarkdownRenderChild} from "obsidian";
import {App} from "vue";

export class SparqlRenderer extends MarkdownRenderChild {
    private app: App<Element>;

    constructor(containerEl: HTMLElement, vueApp: App<Element>) {
        super(containerEl);
        this.app = vueApp
    }

    onload() {
        this.containerEl.removeAttribute('class')
        this.containerEl.setText('')
        const div = this.containerEl.createDiv()
        this.app.mount(div);
    }

    onunload() {
        super.onunload();
        console.log('Unload')
        this.app.unmount()
    }
}