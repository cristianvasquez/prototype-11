import {DateTime} from "luxon";
import {ObsidianRawData} from '../types'
import {config} from "../config.js";
import NamedNodeExt from "rdf-ext/lib/NamedNode";

class Note {
    public readonly noteUri: NamedNodeExt;
    private readonly data: ObsidianRawData;

    constructor(data: ObsidianRawData) {
        this.noteUri = config.encodeURI(data.path)
        this.data = data;
    }

    getRawData() {
        return this.data
    }

    getFileInfo() {
        return {
            uri: this.noteUri,
            name: this.data.name,
            path: this.data.path,
            created: DateTime.fromMillis(this.data.stat.ctime),
            updated: DateTime.fromMillis(this.data.stat.mtime),
            size: this.data.stat.size,
        }
    }
}

export {Note}

