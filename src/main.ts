import {
    App,
    Editor,
    ItemView,
    MarkdownPostProcessorContext,
    Menu,
    Plugin,
    PluginSettingTab,
    Setting,
    WorkspaceLeaf
} from "obsidian";
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
    endpointUrl: string,
    updateUrl: string,
    user: string,
    password: string,
    indexOnOpen: boolean,
    indexOnSave: boolean,
    allowUpdate: boolean
}


const DEFAULT_SETTINGS: MyPluginSettings = {
    endpointUrl: 'http://localhost:3030/obsidian/query',
    updateUrl: 'http://localhost:3030/obsidian/update',
    user: '',
    password: '',
    indexOnOpen: false,
    indexOnSave: true,
    allowUpdate: false
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

        // This adds a settings tab so the user can configure various aspects of the plugin
        this.addSettingTab(new SampleSettingTab(this.app, this));

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

class SampleSettingTab extends PluginSettingTab {
    plugin: Prototype_11;

    constructor(app: App, plugin: Prototype_11) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;

        containerEl.empty();

        containerEl.createEl('h2', {text: 'Settings for prototype 11'});


        new Setting(containerEl)
            .setName('Endpoint url')
            .setDesc('The query endpoint url')
            .addText(text => text
                .setPlaceholder('http://localhost:3030/obsidian/query')
                .setValue(this.plugin.settings.endpointUrl)
                .onChange(async (value) => {
                    this.plugin.settings.endpointUrl = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Update url')
            .setDesc('The update endpoint url')
            .addText(text => text
                .setPlaceholder('http://localhost:3030/obsidian/update')
                .setValue(this.plugin.settings.updateUrl)
                .onChange(async (value) => {
                    this.plugin.settings.updateUrl = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('User')
            .setDesc('Endpoint user (if applies)')
            .addText(text => text
                .setPlaceholder('')
                .setValue(this.plugin.settings.user)
                .onChange(async (value) => {
                    this.plugin.settings.user = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Password')
            .setDesc('Endpoint password (if applies)')
            .addText(text => text
                .setPlaceholder('')
                .setValue(this.plugin.settings.password)
                .onChange(async (value) => {
                    this.plugin.settings.password = value;
                    await this.plugin.saveSettings();
                }));


        // const DEFAULT_SETTINGS: MyPluginSettings = {
        //     user: '',
        //     password: '',
        //     indexOnOpen: false,
        //     indexOnSave: true,
        //
        // }

        new Setting(containerEl)
            .setName('Index on open')
            .setDesc('Index a note each time you open it')
            .addToggle((toggle) => {
                toggle.setValue(this.plugin.settings.indexOnOpen);
                toggle.onChange(async (value) => {
                    this.plugin.settings.indexOnOpen = value;
                    await this.plugin.saveSettings();
                });
            });

        new Setting(containerEl)
            .setName('Index on save')
            .setDesc('Index a note each time you save it')
            .addToggle((toggle) => {
                toggle.setValue(this.plugin.settings.indexOnSave);
                toggle.onChange(async (value) => {
                    this.plugin.settings.indexOnSave = value;
                    await this.plugin.saveSettings();
                });
            });

        new Setting(containerEl)
            .setName('Allow updates')
            .setDesc('Can execute updates in sparql snippets')
            .addToggle((toggle) => {
                toggle.setValue(this.plugin.settings.allowUpdate);
                toggle.onChange(async (value) => {
                    this.plugin.settings.allowUpdate = value;
                    await this.plugin.saveSettings();
                });
            });


    }
}


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