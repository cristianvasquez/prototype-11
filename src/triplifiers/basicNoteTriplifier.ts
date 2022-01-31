import rdf from 'rdf-ext'
import 'core-js/actual/index'
import {getFileTitle} from '../lib/obsidianHelpers'
import {FileData, NamedNode} from "../types";
import clownface from "clownface";

class BasicNoteTriplifier {
    private docUri: NamedNode;
    private ns: any;

    constructor(docUri: NamedNode, ns: any) {
        if (!docUri.value) {
            throw Error('no URI defined')
        }
        if (!ns) {
            throw Error('no namespaces defined')
        }
        this.docUri = docUri
        this.ns = ns
    }

    getRDF(fileData: FileData) {
        // Add all basic fields
        const data = clownface({dataset: rdf.dataset(), term: this.docUri})
            .addOut(this.ns.rdf.type, this.ns.vault.Note)
            .addOut(this.ns.rdfs.label, getFileTitle(fileData.path))
            .addOut(this.ns.vault.path, fileData.path)
            .addOut(this.ns.vault.created, fileData.stat.ctime)
            .addOut(this.ns.vault.size, fileData.stat.size)

        if (fileData.stat.mtime) {
            data.addOut(this.ns.vault.modified, fileData.stat.mtime)
        }

        return data.dataset
    }

}

export {BasicNoteTriplifier}