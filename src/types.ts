import {CachedMetadata, FileStats, LinkCache} from "obsidian";
import {DateTime} from "luxon";

enum TermKind {
    InternalLink,
    ExternalLink,
    LiteralString,
    LiteralDate,
    Tag,
    Array
}

type Triple = {
    subject?: Term,
    predicate: Term,
    object: Term
}
type Term = any

export { Triple, Term, TermKind}