import {Dataset, ObsidianRawData} from "../types";
import {BasicNoteTriplifier} from "../triplifiers/BasicNoteTriplifier";
import {GithubTriplifier} from "../triplifiers/GithubTriplifier";
import {getSections} from './helpers'
import {Note} from './Note'
import Triplestore from './Triplestore'

async function getAllTriples(data: ObsidianRawData, uri: any, ns: any) {
    const noteTriplifier = new BasicNoteTriplifier(uri, ns)
    const noteDataset = noteTriplifier.getRDF(data)
    return await noteDataset.import((await getGithubTriples(data, uri, ns)).toStream())
}

async function getGithubTriples(data: ObsidianRawData, uri: any, ns: any): Promise<Dataset> {
    const githubTriplifier = new GithubTriplifier(uri, ns)
    const result: Dataset = new Dataset()
    const textChunks = getSections(data, (section) => section.type !== 'code')
    for (const chunk of textChunks) {
        const dataset: Dataset = githubTriplifier.triplififyText(chunk)
        if (dataset) {
            await result.import(dataset.toStream())
        }
    }
    return result
}

async function indexNote(triplestore: Triplestore, note: Note, ns: any) {
    const dataset = await getAllTriples(note.getRawData(), note.noteUri, ns)
    await triplestore.deleteDataset(note.noteUri)
    await triplestore.insertDataset(note.noteUri, dataset)
    return dataset.size
}


export {getAllTriples, indexNote}
