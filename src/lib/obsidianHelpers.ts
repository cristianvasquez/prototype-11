import {App, CachedMetadata, SectionCache, TFile} from "obsidian";
import {FileData} from "../types";
import {getActiveFileContent} from 'obsidian-community-lib'

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

async function getDataByFile(app: App, file: TFile): Promise<FileData> {


    //I believe files without unsafeCachedData are
    //The ones that are too big. I'll skip those in the meantime.

    // @ts-ignore
    const text = file.unsafeCachedData ? file.unsafeCachedData
        : await getActiveFileContent(app, true)

    return {
        name: file.name,
        path: file.path,
        stat: file.stat,
        text: text,
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
            data.text?.substring(current.position.start.offset,
                current.position.end.offset)
        )
}


export {collectMetadataForPath, getDataByFile, getFileTitle, getSections}