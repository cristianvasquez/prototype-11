import {App, CachedMetadata, FileStats, LinkCache, SectionCache, TFile} from "obsidian";
import {DateTime} from "luxon";
import {Triple,Term} from "../types";
import {getTriples} from "../triplifiers/dotTriples";


type Metadata = {
    name: string,
    path: string,
    created: DateTime,
    updated: DateTime,
    size: number,
    triples: Array<Triple>
}

type FileData = {
    name: string,
    path: string,
    stat: FileStats,
    text?: string,
    metadata?: CachedMetadata,
    links?: Record<string, number>
    backlinks?: Record<string, [LinkCache]>
}

const collectMetadataForPath = (app: any, path: String) => {
    const dataviewApi = app.plugins.plugins.dataview?.api
    return dataviewApi ? dataviewApi.index.pages.get(path) : {}
}

const getMetadata = (data: FileData): Metadata => {

    const subject:Term = {
        value: 'This',
        entities: {}
    }


    let triples: Array<Triple> = []
    if (data.metadata) {
        // We'll deal with frontmatter later
        // for (const [key, value] of Object.entries(data.metadata.frontmatter)) {
        //
        //     if (key != 'position'){
        //         triples.push({
        //             subject: subject,
        //             predicate: key,
        //             object: value
        //         })
        //     }
        // }
        for (const text of getSections(data)) {
            // Extract mini trippy syntax
            for (const triple of getTriples(text)) {
                if (!triple.subject) {
                    triple.subject = subject
                }
                triples.push(triple)
            }
        }
    }
    return {
        name: data.name,
        path: data.path,
        created: DateTime.fromMillis(data.stat.ctime),
        updated: DateTime.fromMillis(data.stat.mtime),
        size: data.stat.size,
        triples: triples
    }
}


const getMetadataFromPath = (app: any, path: String): CachedMetadata => {
    return app.metadataCache.getCache(path)
}

function getFileTitle(path: string): string {
    if (path.includes("/")) path = path.substring(path.lastIndexOf("/") + 1);
    if (path.endsWith(".md")) path = path.substring(0, path.length - 3);
    return path;
}

const getDataByFile = (app: App, file: TFile): FileData => {
    return {
        name: file.name,
        path: file.path,
        stat: file.stat,
        // @ts-ignore
        text: file.unsafeCachedData,
        metadata: app.metadataCache.getFileCache(file),
        links: app.metadataCache.resolvedLinks[file.path],
        // @ts-ignore
        backlinks: app.metadataCache.getBacklinksForFile(file).data
    }
}

// Gets text for yaml, heading, paragraph etc.
const getSections = (data: FileData, filter?: (section: SectionCache) => boolean) => {
    if (!filter) {
        filter = _ => true
    }
    return data.metadata.sections
        .filter(filter)
        .map((current) =>
            data.text.substring(current.position.start.offset,
                current.position.end.offset)
        )
}


export {collectMetadataForPath, getDataByFile, getMetadata, getFileTitle, FileData, Metadata, getSections}