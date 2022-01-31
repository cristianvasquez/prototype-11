import {DateTime} from "luxon";
import Dataset from "rdf-ext/lib/Dataset";
import NamedNode from "rdf-ext/lib/NamedNode";
import Quad from "rdf-ext/lib/Quad";
import Literal from "rdf-ext/lib/Literal";

import {App, CachedMetadata, FileStats, TFile} from "obsidian";

type AppContext = {
    triplestore: any,
    config: SparqlConfig,
    getFirstLinkpathDest: (linkpath: string) => TFile | null
    app: App
}

type SparqlConfig = {
    tFileToURI: (noteName: TFile) => NamedNode,
    uriToNoteName: (uri: NamedNode) => string,
    replaceInternalLinks: (query: string, resolver: ((linkpath: string) => TFile | null)) => string,
    isInternal: any,
    selectToTable: any,
    datasetToTable: any,
}

type Metadata = {
    uri: string,
    name: string,
    path: string,
    created: DateTime,
    updated: DateTime,
    size: number,
    rdf?: Dataset
}

type FileData = {
    name: string,
    path: string,
    stat: FileStats,
    text?: string,
    metadata?: CachedMetadata,

    // These will naturally happen through the triplestore

    // links?: Record<string, number>
    // backlinks?: Record<string, [LinkCache]>
}

type Triple = {
    subject?: Term,
    predicate: Term,
    object: Term
}
type Term = any

export {
    Quad,
    Literal,
    Dataset,
    NamedNode,
    Triple,
    Term,
    FileData,
    Metadata,
    SparqlConfig,
    AppContext
}