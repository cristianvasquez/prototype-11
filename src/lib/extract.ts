import {Triple} from "../types";
import {getDotTriples} from "../triplifiers/dotTriples";
import {DateTime} from "luxon";
import {FileData, getSections, Metadata} from "./helpers";


function extractDotTriples(data: FileData) {

    const textChunks = getSections(data, (section) => section.type !== 'code')
    const pairs: Array<Triple> = []
    const triads: Array<Triple> = []

    for (const text of textChunks) {
        // Extract mini dotTrippy syntax
        for (const triple of getDotTriples(text)) {
            if (!triple.subject) {
                pairs.push(triple)
            } else {
                triads.push(triple)
            }
        }
    }
    return [pairs, triads];
}

// function extractDatasets(data: FileData) {
//
//     const textChunks = getSections(data, (section) => section.type !== 'code')
//
//
//
//     for (const text of textChunks) {
//         // Extract mini trippy syntax
//         for (const triple of getDotTriples(text)) {
//             if (!triple.subject) {
//                 pairs.push(triple)
//             } else {
//                 triads.push(triple)
//             }
//         }
//     }
//     return [pairs, triads];
// }


import rdf from 'rdf-ext'
const getMetadata = (data: FileData): Metadata => {


    // const namespace = rdf.namespace
    //
    // const ns = {
    //     schema: namespace('http://schema.org/'),
    //     vault: namespace('http://vault.org/'),
    //     rdf: namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
    // }

    const result: Metadata = {
        name: data.name,
        path: data.path,
        created: DateTime.fromMillis(data.stat.ctime),
        updated: DateTime.fromMillis(data.stat.mtime),
        size: data.stat.size,
    }

    const [pairs, triads] = extractDotTriples(data)
    if (pairs.length) {
        result.pairs = pairs
    }
    if (triads.length) {
        result.triads = triads
    }
    return result
}



export {getMetadata}

