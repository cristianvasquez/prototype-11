import {getDotTriples} from "../triplifiers/dotTriples";
import {DateTime} from "luxon";
import {getSections} from "./obsidianHelpers";
import {Dataset, FileData, NamedNode, Triple} from '../types'
import {GithubTriplifier} from '../triplifiers/githubTriplifier'
import {BasicNoteTriplifier} from "../triplifiers/basicNoteTriplifier";

class Extract {
    private readonly uri: NamedNode;
    private readonly fileData: FileData;
    private readonly ns: any;

    constructor(uri: NamedNode, fileData: FileData, ns: any) {
        this.fileData = fileData;
        this.uri = uri;
        this.ns = ns;
    }

    getUri(): NamedNode {
        return this.uri
    }

    getNS() {
        return this.ns
    }

    getMetadata() {
        return {
            name: this.fileData.name,
            path: this.fileData.path,
            created: DateTime.fromMillis(this.fileData.stat.ctime),
            updated: DateTime.fromMillis(this.fileData.stat.mtime),
            size: this.fileData.stat.size,
        }
    }

    getDotTriples(): Array<Triple> {
        const textChunks = getSections(this.fileData, (section) => section.type !== 'code')
        let result: Array<Triple> = []
        for (const chunk of textChunks) {
            for (const triples of getDotTriples(chunk)) {
                result = [...result, ...triples]
            }
        }
        return result;
    }

    async applyTriplifiers(): Promise<Dataset> {
        // Github triplifier
        const githubTriplifier = new GithubTriplifier(this.uri, this.ns)

        const result: Dataset = new Dataset()
        const textChunks = getSections(this.fileData, (section) => section.type !== 'code')
        for (const chunk of textChunks) {
            const dataset: Dataset = githubTriplifier.triplififyText(chunk)
            if (dataset) {
                await result.import(dataset.toStream())
            }
        }
        return result
    }

    async getRDF() {
        const noteTriplifier = new BasicNoteTriplifier(this.uri, this.ns)
        const noteDataset = noteTriplifier.getRDF(this.fileData)
        return noteDataset.import((await this.applyTriplifiers()).toStream())
    }

}

export {Extract}

