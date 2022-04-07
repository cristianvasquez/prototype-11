import {DateTime} from "luxon";
import Dataset from "rdf-ext/lib/Dataset";
import {App, CachedMetadata, FileStats, LinkCache} from "obsidian";

type AppContext = {
    triplestore:any,
    config:SparqlConfig,
    app:App
}

type SparqlConfig = {
    pathToUri:any,
    uriToPath:any,
    selectToTable:any,
    datasetToTable:any,
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

type StructuredData = {
    uri: string,
    name: string,
    path: string,
    created: DateTime,
    updated: DateTime,
    size: number,
    pairs?: Array<Triple>,
    triads?: Array<Triple>,
    rdf?: Dataset
}

type Triple = {
    subject?: Term,
    predicate: Term,
    object: Term
}
type Term = any

export {Triple, Term, ObsidianRawData, StructuredData, Dataset, SparqlConfig, AppContext}