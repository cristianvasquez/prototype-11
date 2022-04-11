import {Dataset, ObsidianRawData} from "../types";
import {BasicNoteTriplifier} from "../triplifiers/BasicNoteTriplifier";
import {GithubTriplifier} from "../triplifiers/GithubTriplifier";
import {DotTriplesTriplifier} from "../triplifiers/DotTriplesTriplifier";

import {getSections} from './helpers.js'
import {Note} from './Note'
import Triplestore from './Triplestore'

async function getAllTriples(data: ObsidianRawData, uri: any, ns: any, uriResolvers: any) {
    const noteTriplifier = new BasicNoteTriplifier(uri, ns)
    const noteDataset = noteTriplifier.getRDF(data)
    await noteDataset
        .import((await applyTriplifier(data, uriResolvers, new DotTriplesTriplifier(uri, ns))).toStream())
    await noteDataset
        .import((await applyTriplifier(data, uriResolvers, new GithubTriplifier(uri, ns))).toStream())
    return noteDataset
}

async function applyTriplifier(data: ObsidianRawData, uriResolvers: any, triplifier: any,) {
    const result: Dataset = new Dataset()
    const textChunks = getSections(data, (section: any) => section.type !== 'code')
    for (const chunk of textChunks) {
        const dataset: Dataset = triplifier.triplififyText(chunk, uriResolvers)
        if (dataset) {
            await result.import(dataset.toStream())
        }
    }
    return result
}

async function indexNote(triplestore: Triplestore, note: Note, ns: any, uriResolvers: any) {
    const dataset = await getAllTriples(note.getRawData(), note.noteUri, ns, uriResolvers)
    await triplestore.deleteDataset(note.noteUri)
    await triplestore.insertDataset(note.noteUri, dataset)
    return dataset.size
}


export {getAllTriples, indexNote}
