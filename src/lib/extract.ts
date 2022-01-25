import {getDotTriples} from "../triplifiers/dotTriples";
import {DateTime} from "luxon";
import {getSections} from "./obsidianHelpers";
import {Dataset, FileData, Triple} from '../types'
import {GithubTriplifier} from '../triplifiers/githubTriplifier.js'
import {FrontMatterCache} from "obsidian";
import {BasicNoteTriplifier} from "../triplifiers/basicNoteTriplifier";

function noteUri(frontMatter: FrontMatterCache, path: string) {
    const identifier = frontMatter?.id ? frontMatter.id : encodeURI(path);
    return `http://cristianvasquez.me/note/${identifier}`
}

class NoteData {
    public readonly noteUri: string;
    private readonly data: FileData;
    private readonly ns: any;

    constructor(data: FileData, ns: any) {
        this.data = data;
        this.ns = ns;
        this.noteUri = noteUri(data.metadata.frontmatter, data.path)
    }

    getMetadata() {
        return {
            uri: this.noteUri,
            name: this.data.name,
            path: this.data.path,
            created: DateTime.fromMillis(this.data.stat.ctime),
            updated: DateTime.fromMillis(this.data.stat.mtime),
            size: this.data.stat.size,
        }
    }

    getDotTriples(): Array<Triple> {
        const textChunks = getSections(this.data, (section) => section.type !== 'code')
        let result: Array<Triple> = []
        for (const chunk of textChunks) {
            for (const triples of getDotTriples(chunk)) {
                result = [...result, ...triples]
            }
        }
        return result;
    }

    async getBasicDataset(): Promise<Dataset> {
        const githubTriplifier = new GithubTriplifier(this.noteUri, this.ns)
        const result: Dataset = new Dataset()
        const textChunks = getSections(this.data, (section) => section.type !== 'code')
        for (const chunk of textChunks) {
            const dataset: Dataset = githubTriplifier.triplififyText(chunk)
            if (dataset) {
                await result.import(dataset.toStream())
            }
        }
        return result
    }

    async getFullDataset() {

        const noteTriplifier = new BasicNoteTriplifier(this.noteUri, this.ns)
        const noteDataset = noteTriplifier.getRDF(this.data)

        await noteDataset.import((await this.getBasicDataset()).toStream())

        return {
            dataset: noteDataset,
            dotTriples: this.getDotTriples()
        }
    }

}

export {NoteData}

