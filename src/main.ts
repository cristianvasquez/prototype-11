import {
    App,
    Editor,
    ItemView,
    MarkdownPostProcessorContext,
    Plugin,
    PluginSettingTab,
    Setting,
    TFile,
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
import {ns} from './namespaces'
import {EventEmitter} from "./lib/EventEmitter.js";
import {Prototype11} from "./lib/Prototype11";
import {Note} from "./lib/Note";
import {indexNote} from "./lib/indexer";

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

        this.addSettingTab(new SampleSettingTab(this.app, this));

        const client: ParsingClient = new Client(this.settings.clientSettings)
        const triplestore = new Triplestore(client)


        async function indexFile(file: TFile, app:App) {
            console.log('Indexing', file.path)
            const rawData = await new Prototype11(app, file).getRawData()
            const note = new Note(rawData)
            await indexNote(triplestore, note, ns)
            console.log('Index done')
            events.emit('update', file)
        }

        async function deleteIndex(path: String) {
            const uri = config.pathToUri(path)
            await triplestore.deleteDataset(uri)
        }

        /**
         * Event logic
         */

        const events = new EventEmitter()
        // // Source for save setting
        // // https://github.com/hipstersmoothie/obsidian-plugin-prettier/blob/main/src/main.ts
        const saveCommandDefinition = (this.app as any).commands?.commands?.[
            'editor:save-file'
            ];
        const save = saveCommandDefinition?.callback;
        if (typeof save === 'function') {
            saveCommandDefinition.callback = async () => {
                const file = this.app.workspace.getActiveFile();
                await indexFile(file, this.app)
            };
        }

        // @ts-ignore
        let plugin = app.plugins.plugins[PLUGIN_NAME]
        // plugin.registerEvent(
        //     this.app.metadataCache.on('changed', file => {
        //         console.log('file modified')
        //     })
        // )
        plugin.registerEvent(
            this.app.vault.on('rename', async (file, oldPath) => {
                if (!(file instanceof TFile)) return
                console.log('renaming')
                await deleteIndex(oldPath)
                events.emit('update', file)
            })
        )
        plugin.registerEvent(
            this.app.vault.on('delete', async af => {
                if (!(af instanceof TFile)) return
                console.log('deleting')
                await deleteIndex(af.path)
                events.emit('update', undefined)
            })
        )
        plugin.registerEvent(
            this.app.workspace.on('file-open', (file) => {
                events.emit('update', file)
            })
        )

        /**
         * The apps
         */

            // Debug view
        const appContext = {
                app: this.app,
                triplestore: triplestore,
                events: events,
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