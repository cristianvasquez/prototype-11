import {Triple} from "../types";
import {getDotTriples, toSPO} from "../triplifiers/dotTriples";
import {DateTime} from "luxon";
import {getSections} from "./obsidianHelpers";
import {FileData, Metadata} from '../types'
import {GithubTriplifier} from '../triplifiers/github'
import Dataset from "rdf-ext/lib/Dataset";
import {ns} from '../namespaces.js'
import {FrontMatterCache} from "obsidian";

function extractDotTriples(data: FileData) {

    const textChunks = getSections(data, (section) => section.type !== 'code')
    const pairs: Array<Triple> = []
    const triads: Array<Triple> = []

    for (const text of textChunks) {
        for (const triples of getDotTriples(text)) {
            for (const triple of triples) {
                if (!triple.subject) {
                    pairs.push(triple)
                } else {
                    triads.push(triple)
                }
            }
        }
    }
    return [pairs, triads];
}

async function extractDatasets(data: FileData, noteUri: string): Promise<Dataset> {

    const githubTriplifier = new GithubTriplifier(noteUri, ns)

    const result: Dataset = new Dataset()
    const textChunks = getSections(data, (section) => section.type !== 'code')
    for (const text of textChunks) {
        const dataset: Dataset = githubTriplifier.triplififyText(text)
        if (dataset) {
            await result.import(dataset.toStream())
        }
    }
    return result
}


function noteURI(frontMatter: FrontMatterCache, path: string) {
    const identifier = frontMatter?.id ? frontMatter.id : encodeURI(path);
    return `http://cristianvasquez.me/note/${identifier}`
}

async function getMetadata(data: FileData): Promise<Metadata> {
    // const namespace = rdf.namespace
    //
    // const ns = {
    //     schema: namespace('http://schema.org/'),
    //     vault: namespace('http://vault.org/'),
    //     rdf: namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
    // }
    const noteUri = noteURI(data.metadata.frontmatter, data.path)
    const result: Metadata = {
        uri: noteUri,
        name: data.name,
        path: data.path,
        created: DateTime.fromMillis(data.stat.ctime),
        updated: DateTime.fromMillis(data.stat.mtime),
        size: data.stat.size,
    }

    const [pairs, triads] = extractDotTriples(data)
    if (pairs.length) {
        result.pairs = pairs
    }
    if (triads.length) {
        result.triads = triads
    }
    const dataset = await extractDatasets(data, noteUri)
    if (dataset.size) {
        result.rdf = dataset
    }

    return result
}


export {getMetadata}

