import {MarkdownRenderChild} from "obsidian";
import {App, createApp} from "vue";
import SparqlView from "./views/SparqlView.vue";

export class SparqlResult extends MarkdownRenderChild {
    private vueApp: App<Element>;

    constructor(containerEl: HTMLElement, text: string, lang:string) {
        super(containerEl);
        this.vueApp = createApp(SparqlView)
        this.vueApp.provide('text', text)
        this.vueApp.provide('lang', lang)
    }

    onload() {
        this.containerEl.removeAttribute('class')
        this.containerEl.setText('')
        const div = this.containerEl.createDiv()
        this.vueApp.mount(div);
    }

    onunload() {
        super.onunload();
        console.log('Unload')
        this.vueApp.unmount()
    }
}