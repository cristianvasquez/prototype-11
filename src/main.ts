import {ItemView, Menu, Plugin, WorkspaceLeaf} from "obsidian";
import {createApp} from 'vue'
import DebugView from './views/DebugView.vue'
import {PLUGIN_NAME} from "./consts";
import {SparqlRenderer} from "./sparql";
import ParsingClient from "sparql-http-client/ParsingClient";
import Client from "sparql-http-client/ParsingClient";
import {Triplestore} from "./lib/client";
import SparqlView from "./views/SparqlView.vue";

interface MyPluginSettings {
    mySetting: string
}

const DEFAULT_SETTINGS: MyPluginSettings = {
    mySetting: 'default'
}

export default class Prototype_11 extends Plugin {
    settings: MyPluginSettings
    private vueApp: DebugView<Element>;
    private triplestore: Triplestore;

    async onload() {

        console.log(`loading ${PLUGIN_NAME}`)
        await this.loadSettings()

        this.addRibbonIcon("dice", "Open menu", (event) => {
            const menu = new Menu(this.app);
            // Here one can add several items
            menu.addItem((item) => item.setTitle("A nice 🍎").setIcon("paste").onClick(() => {
                this.activateSidePanel()
            }));
            menu.showAtMouseEvent(event);
        });

        this.addCommand({
            id: 'open-prototype-11',
            name: 'Open prototype 11',
            checkCallback: (checking: boolean) => {
                let leaf = this.app.workspace.activeLeaf
                if (leaf) {
                    if (!checking) {
                        this.activateSidePanel()
                    }
                    return true
                }
                return false
            }
        })

        const client: ParsingClient = new Client({
            endpointUrl: 'http://localhost:3030/obsidian/query',
            updateUrl: 'http://localhost:3030/obsidian/update',
            user: '',
            password: ''
        })
        const triplestore = new Triplestore(client)

        function createDebugApp() {
            const debugApp = createApp(DebugView)
            debugApp.provide('register', this.registerEvent)
            debugApp.provide('triplestore', triplestore)
            debugApp.provide('app', this.app)
            return debugApp
        }

        function createSparqlApp(text: string, lang: string) {
            const sparqlApp = createApp(SparqlView)
            sparqlApp.provide('text', text)
            sparqlApp.provide('lang', lang)
            sparqlApp.provide('triplestore', triplestore)
            return sparqlApp
        }


        this.vueApp = createDebugApp()

        this.registerMarkdownPostProcessor((element, context) => {

            const codeblocks = element.querySelectorAll("code");

            for (let index = 0; index < codeblocks.length; index++) {
                const codeblock = codeblocks.item(index);
                const lang = codeblock.getAttribute('class')
                if (lang?.startsWith('language-sparql')) {
                    const text = codeblock.innerText.trim();
                    const renderer = new SparqlRenderer(codeblock, createSparqlApp(text, lang))
                    context.addChild(renderer)
                }
            }

        })


        this.registerView(SIDE_VIEW_ID,
            (leaf) => new CurrentFileView(leaf, this.vueApp));
    }

    onunload() {
        this.app.workspace.detachLeavesOfType(SIDE_VIEW_ID);
        console.log('unloading plugin')
    }

    async activateSidePanel() {
        this.app.workspace.detachLeavesOfType(SIDE_VIEW_ID);
        await this.app.workspace.getRightLeaf(false).setViewState({type: SIDE_VIEW_ID, active: true});
        this.app.workspace.revealLeaf(this.app.workspace.getLeavesOfType(SIDE_VIEW_ID)[0]);
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
    }

    async saveSettings() {
        await this.saveData(this.settings)
    }
}
export const SIDE_VIEW_ID = `${PLUGIN_NAME}-sideview`;


export class CurrentFileView extends ItemView {
    private vueApp: DebugView<Element>;

    constructor(leaf: WorkspaceLeaf, vueApp: DebugView<Element>) {
        super(leaf);
        this.vueApp = vueApp
        this.vueApp.provide('view', this)

    }

    getViewType() {
        return SIDE_VIEW_ID;
    }

    getDisplayText() {
        return `${SIDE_VIEW_ID}`;
    }

    async onOpen() {
        const container = this.containerEl.children[1];
        this.vueApp.mount(container);
    }

    async onClose() {
        this.vueApp.unmount()
    }
}