import {DateTime} from "luxon";
import Dataset from "rdf-ext/lib/Dataset";
import {CachedMetadata, FileStats, LinkCache} from "obsidian";

type Metadata = {
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

type FileData = {
    name: string,
    path: string,
    stat: FileStats,
    text?: string,
    metadata?: CachedMetadata,
    links?: Record<string, number>
    backlinks?: Record<string, [LinkCache]>
}

type Triple = {
    subject?: Term,
    predicate: Term,
    object: Term
}
type Term = any

export {Triple, Term, FileData, Metadata, Dataset}