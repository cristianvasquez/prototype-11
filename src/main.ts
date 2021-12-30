import {ItemView, Menu, Modal, Notice, Plugin, PluginSettingTab, Setting, WorkspaceLeaf} from "obsidian";
import {createApp, ref} from 'vue'
import App from './App.vue'
import {PLUGIN_NAME} from "./consts";

interface MyPluginSettings {
    mySetting: string
}

const DEFAULT_SETTINGS: MyPluginSettings = {
    mySetting: 'default'
}

export default class Prototype_11 extends Plugin {
    settings: MyPluginSettings
    private vueApp: App<Element>;

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

        this.vueApp = createApp(App, {
            app: this.app,
            register: this.registerEvent
        })


        this.registerView(SIDE_VIEW_ID,
            (leaf) => new CurrentFileView(leaf, this.vueApp));
        this.addSettingTab(new Settings(this.app, this))
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
    private vueApp: App<Element>;

    constructor(leaf: WorkspaceLeaf, vueApp: App<Element>) {
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
        const app = this.vueApp.mount(container);
    }

    async onClose() {
        this.vueApp.unmount()
    }
}


class FacetsDisabledSettings extends PluginSettingTab {
    plugin: Prototype_11

    constructor(app: App, plugin: Prototype_11) {
        super(app, plugin)
        this.plugin = plugin
    }

    display(): void {
        let {containerEl} = this
        containerEl.empty()
        containerEl.createEl('h2', {text: 'Facets depends on dataview.'})
    }
}


class Settings extends PluginSettingTab {
    plugin: Prototype_11

    constructor(app: App, plugin: Prototype_11) {
        super(app, plugin)
        this.plugin = plugin
    }

    display(): void {
        let {containerEl} = this

        containerEl.empty()

        containerEl.createEl('h2', {text: 'Obsidian facets.'})

        new Setting(containerEl)
            .setName('Setting #1')
            .setDesc("It's a secret")
            .addText(text =>
                text
                    .setPlaceholder('Enter your secret')
                    .setValue('')
                    .onChange(async value => {
                        console.log('Secret: ' + value)
                        this.plugin.settings.mySetting = value
                        await this.plugin.saveSettings()
                    })
            )
    }
}
