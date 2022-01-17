import {App, CachedMetadata, FileStats, LinkCache, SectionCache, TFile} from "obsidian";
import {DateTime} from "luxon";
import {Triple} from "../types";


type Metadata = {
    name: string,
    path: string,
    created: DateTime,
    updated: DateTime,
    size: number,
    pairs?: Array<Triple>,
    triads?: Array<Triple>
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


export {collectMetadataForPath, getDataByFile, getFileTitle, FileData, Metadata, getSections}