import {getDotTriples} from "../triplifiers/dotTriples";
import {DateTime} from "luxon";
import {Dataset, ObsidianRawData, Triple} from '../types'
import {GithubTriplifier} from '../triplifiers/GithubTriplifier.js'
import {BasicNoteTriplifier} from "../triplifiers/BasicNoteTriplifier";
import config from "../config.js";
import NamedNodeExt from "rdf-ext/lib/NamedNode";
import {SectionCache} from 'obsidian'


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

async function getAllTriples(data: ObsidianRawData, uri: any, ns: any) {
    const noteTriplifier = new BasicNoteTriplifier(uri, ns)
    const noteDataset = noteTriplifier.getRDF(data)
    return await noteDataset.import((await getGithubTriples(data, uri, ns)).toStream())
}


async function getGithubTriples(data: ObsidianRawData, uri: any, ns: any): Promise<Dataset> {
    const githubTriplifier = new GithubTriplifier(uri, ns)
    const result: Dataset = new Dataset()
    const textChunks = getSections(data, (section) => section.type !== 'code')
    for (const chunk of textChunks) {
        const dataset: Dataset = githubTriplifier.triplififyText(chunk)
        if (dataset) {
            await result.import(dataset.toStream())
        }
    }
    return result
}

/**
 * Gets text for yaml, heading, paragraph etc.
 * @param data
 * @param filter
 */
const getSections = (data: ObsidianRawData, filter?: (section: SectionCache) => boolean) => {
    if (!filter) {
        filter = _ => true
    }
    if (!data.metadata.sections) {
        return []
    }
    return data.metadata.sections
        .filter(filter)
        .map((current) =>
            data.text?.substring(current.position.start.offset,
                current.position.end.offset)
        )
}


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

export {Note, getAllTriples, getGithubTriples, rawDataToDotTriples}

