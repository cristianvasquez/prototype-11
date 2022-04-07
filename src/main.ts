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
import DebugView from './UI/DebugView.vue'
import {PLUGIN_NAME} from "./consts";
import ParsingClient from "sparql-http-client/ParsingClient";
import Client from "sparql-http-client/ParsingClient";
import Triplestore from "./lib/Triplestore";
import SparqlView from "./UI/SparqlView.vue";
import {getTemplate} from "./triplifiers/utils";
import config from "./config";
import { ns } from './namespaces'


interface ClientSettings {
    endpointUrl: string,
    updateUrl: string,
    user: string,
    password: string,
}

interface PluginSettings {
    clientSettings: ClientSettings,
    indexOnOpen: boolean,
    indexOnSave: boolean,
    allowUpdate: boolean
}

const DEFAULT_SETTINGS: PluginSettings = {
    clientSettings: {
        endpointUrl: 'http://localhost:3030/obsidian/query',
        updateUrl: 'http://localhost:3030/obsidian/update',
        user: '',
        password: ''
    },
    indexOnOpen: false,
    indexOnSave: true,
    allowUpdate: false
}

export default class Prototype_11 extends Plugin {
    settings: PluginSettings
    private vueApp: DebugView<Element>;
    private triplestore: Triplestore;

    async onload() {

        console.log(`loading ${PLUGIN_NAME}`)
        await this.loadSettings()

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

        this.addCommand({
            id: "index-current-note",
            name: "Index current note",
            checkCallback: (checking: boolean) => {
                console.log('TODO')
                return false
            }
        });

        this.addSettingTab(new SampleSettingTab(this.app, this));

        const client: ParsingClient = new Client(this.settings.clientSettings)
        const triplestore = new Triplestore(client)

        // // Source for save setting
        // // https://github.com/hipstersmoothie/obsidian-plugin-prettier/blob/main/src/main.ts
        const saveCommandDefinition = (this.app as any).commands?.commands?.[
            'editor:save-file'
            ];
        const save = saveCommandDefinition?.callback;

        if (typeof save === 'function') {
            saveCommandDefinition.callback = () => {
                    const file = this.app.workspace.getActiveFile();
                    // should index file
                    console.log('Indexme!')
            };
        }

        // Debug view
        const appContext = {
            app: this.app,
            triplestore: triplestore,
            config: config,
            ns: ns
        }

        const debugApp = createApp(DebugView)
        debugApp.provide('register', this.registerEvent)
        debugApp.provide('context', appContext)
        this.vueApp = debugApp

        this.registerView(SIDE_VIEW_ID,
            (leaf) => new CurrentFileView(leaf, this.vueApp));

        // Renders the results of a SPARQL query
        function getProcessor(app: App) {
            return (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
                const sparqlApp = createApp(SparqlView)
                sparqlApp.provide('context', appContext)
                sparqlApp.provide('text', config.replaceNotesToURIs(source, app))
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
                .setValue(this.plugin.settings.clientSettings.endpointUrl)
                .onChange(async (value) => {
                    this.plugin.settings.clientSettings.endpointUrl = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Update url')
            .setDesc('The update endpoint url')
            .addText(text => text
                .setPlaceholder('http://localhost:3030/obsidian/update')
                .setValue(this.plugin.settings.clientSettings.updateUrl)
                .onChange(async (value) => {
                    this.plugin.settings.clientSettings.updateUrl = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('User')
            .setDesc('Endpoint user (if applies)')
            .addText(text => text
                .setPlaceholder('')
                .setValue(this.plugin.settings.clientSettings.user)
                .onChange(async (value) => {
                    this.plugin.settings.clientSettings.user = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Password')
            .setDesc('Endpoint password (if applies)')
            .addText(text => text
                .setPlaceholder('')
                .setValue(this.plugin.settings.clientSettings.password)
                .onChange(async (value) => {
                    this.plugin.settings.clientSettings.password = value;
                    await this.plugin.saveSettings();
                }));

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