import Dataset from "rdf-ext/lib/Dataset";
import {App, CachedMetadata, FileStats, LinkCache} from "obsidian";
import {EventEmitter} from "./lib/EventEmitter";

type AppContext = {
    triplestore: any,
    config: SparqlConfig,
    app: App,
    events: EventEmitter,
    uriResolvers: any,
    ns: any
}

type SparqlConfig = {
    pathToUri: any,
    uriToPath: any,
    selectToTable: any,
    datasetToTable: any,
}

type ObsidianRawData = {
    name: string,
    path: string,
    stat: FileStats,
    text?: string,
    metadata?: CachedMetadata,
    links?: Record<string, number>
    backlinks?: Record<string, [LinkCache]>
}

type Triple = {
    raw: String,
    subject: Term,
    predicate: Term,
    object: Term
}
type Term = {
    entities:any
}

export {Triple, Term, ObsidianRawData, Dataset, SparqlConfig, AppContext}