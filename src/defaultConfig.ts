import {ns} from './namespaces'
import {LINKS_REGEXP} from './lib/regexp'
import {TFile} from "obsidian";
import Dataset from "rdf-ext/lib/Dataset";
import {NamedNode, SparqlConfig} from "./types";

function replaceInternalLinks(query: string, getFirstLinkpathDest: any) {
    const convert = (str: any, p1: string, offset: any, s: any) => {
        const linkPath = getFirstLinkpathDest(p1)
        if (linkPath) {
            const uri = tFileToURI(linkPath).value
            return `<${uri}>`
        } else {
            throw new Error(`Cannot find:${p1}`)
        }
    }

    return query.replace(LINKS_REGEXP, convert)
}

function tFileToURI(tfile: TFile): NamedNode {
    // @ts-ignore
    return ns.this(btoa(unescape(encodeURIComponent(tfile.basename))))
}

function uriToNoteName(uri: NamedNode) {
    const coding = uri.value.replace(new RegExp(`^${ns.this()}`), '')
    return decodeURIComponent(escape(atob(coding)))
}

function isInternal(value: string) {
    //@ts-ignore
    return value.startsWith(ns.this())
}

function selectToTable(sparqlSelectResult: any) {
    let header: Array<string> = []
    let rows = []
    for (const current of sparqlSelectResult) {
        if (!header) {
            header = Object.keys(current)
        }
        rows.push(Object.values(current).map((current: NamedNode) => current.value))
    }
    return {
        header: header,
        rows: rows
    }
}

function datasetToTable(dataset: Dataset) {
    let header = ['subject', 'predicate', 'object']
    let rows = []
    // Map does not work?
    //   rows = dataset.toArray().map((quad)=>[quad.subject.value, quad.predicate.value, quad.object.value])
    for (const quad of dataset) {
        rows.push([quad.subject.value, quad.predicate.value, quad.object.value])
    }

    return {
        header: header,
        rows: rows
    }
}

const defaultConfig: SparqlConfig = {
    tFileToURI,
    uriToNoteName,
    replaceInternalLinks,
    isInternal,
    selectToTable,
    datasetToTable
}

export {defaultConfig}
