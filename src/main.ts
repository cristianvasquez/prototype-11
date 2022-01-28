import {App, Editor, ItemView, MarkdownPostProcessorContext, Menu, Plugin, WorkspaceLeaf} from "obsidian";
import {createApp} from 'vue'
import DebugView from './views/DebugView.vue'
import {PLUGIN_NAME} from "./consts";
import ParsingClient from "sparql-http-client/ParsingClient";
import Client from "sparql-http-client/ParsingClient";
import {Triplestore} from "./lib/client";
import SparqlView from "./views/SparqlView.vue";
import {getTemplate} from "./triplifiers/utils";
import {defaultConfig} from "./defaultConfig";

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

        this.addCommand({
            id: "insert-sparql-template", name: "Insert Sparql template", editorCallback: (editor: Editor) => {
                editor.replaceRange(getTemplate(), editor.getCursor());
            },
        });

        const client: ParsingClient = new Client({
            endpointUrl: 'http://localhost:3030/obsidian/query',
            updateUrl: 'http://localhost:3030/obsidian/update',
            user: '',
            password: ''
        })
        const triplestore = new Triplestore(client)

        // Debug view

        const defaultContext = {
            triplestore: triplestore,
            config: defaultConfig,
            app: this.app
        }

        const debugApp = createApp(DebugView)
        debugApp.provide('register', this.registerEvent)
        debugApp.provide('context', defaultContext)
        this.vueApp = debugApp

        this.registerView(SIDE_VIEW_ID,
            (leaf) => new CurrentFileView(leaf, this.vueApp));

        // Sparql post processor

        function getProcessor(app: App) {
            return (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
                const sparqlApp = createApp(SparqlView)
                sparqlApp.provide('text', source)
                sparqlApp.provide('context', defaultContext)
                sparqlApp.mount(el)
            }
        }

        this.registerMarkdownCodeBlockProcessor("sparql", getProcessor(this.app));
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