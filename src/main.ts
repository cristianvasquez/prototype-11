import {ItemView, Menu, Modal, Notice, Plugin, PluginSettingTab, Setting, WorkspaceLeaf} from "obsidian";
import {createApp, ref} from 'vue'
import DebugView from './DebugView.vue'
import {PLUGIN_NAME} from "./consts";

interface MyPluginSettings {
    mySetting: string
}

const DEFAULT_SETTINGS: MyPluginSettings = {
    mySetting: 'default'
}

export default class Prototype_11 extends Plugin {
    settings: MyPluginSettings
    private vueApp: DebugView<Element>;

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

        this.vueApp = createApp(DebugView)
        this.vueApp.provide('register', this.registerEvent)
        this.vueApp.provide('app', this.app)

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