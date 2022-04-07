import {TFile, App} from "obsidian";
import {getActiveFileContent} from "obsidian-community-lib";

class Prototype11 {

    private readonly file: TFile
    private readonly app: App

    constructor(app: App, file: TFile) {
        this.app = app;
        this.file = file
    }

    async getRawData() {
        // I believe files without unsafeCachedData are the ones that are too big.
        // I don't have a clue what's the life-cycle in Obsidian. I'll skip those in the meantime

        // @ts-ignore
        // const text = this.file.unsafeCachedData ? this.file.unsafeCachedData : await getActiveFileContent(app, true)

        const text = await getActiveFileContent(app, true)

        return {
            name: this.file.name,
            path: this.file.path,
            stat: this.file.stat,
            text: text,
            metadata: app.metadataCache.getFileCache(this.file),
            links: app.metadataCache.resolvedLinks[this.file.path],
            // @ts-ignore
            backlinks: app.metadataCache.getBacklinksForFile(this.file).data
        }
    }

}

export {Prototype11}

