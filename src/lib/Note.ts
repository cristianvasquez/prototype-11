import {getDotTriples} from "../triplifiers/dotTriples";
import {DateTime} from "luxon";
import {ObsidianRawData, Triple} from '../types'
import config from "../config.js";
import NamedNodeExt from "rdf-ext/lib/NamedNode";
import {getSections} from "./helpers";

class Note {
    public readonly noteUri: NamedNodeExt;
    private readonly data: ObsidianRawData;

    constructor(data: ObsidianRawData) {
        this.noteUri = config.pathToUri(data.path)
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

function rawDataToDotTriples(data: ObsidianRawData): Array<Triple> {
    const textChunks = getSections(data, (section) => section.type !== 'code')
    let result: Array<Triple> = []
    for (const chunk of textChunks) {
        for (const triples of getDotTriples(chunk)) {
            if (triples.length) {
                result = [...result, ...triples]
            }
        }
    }
    return result;
}

export {Note, rawDataToDotTriples}

