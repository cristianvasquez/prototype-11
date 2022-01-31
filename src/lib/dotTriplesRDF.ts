import {AppContext, Dataset, Literal, Quad, Triple} from "../types";
import rdf from "rdf-ext";
// @ts-ignore
import slugify from 'slugify';
import {getInternalLinks} from "../triplifiers/miniNLP";
import {TFile} from "obsidian";
import NamedNode from "rdf-ext/lib/NamedNode";

function getDotTriplesRDF(noteId: NamedNode,
                          triples: Array<Triple>,
                          appContext: AppContext,
                          ns: any
): Dataset {
    const _vault = ns.vault

    function linkToURI(value: string): NamedNode {
        const file: TFile = appContext.getFirstLinkpathDest(value)
        if (file) {
            return appContext.config.tFileToURI(file)
        } else {
            throw new Error(`Cannot find:${value}`)
        }
    }

    function getNamedNode(value: string) {
        return _vault(slugify(value))
    }

    function getSP(value: string): Array<NamedNode> {
        if (!value) {
            return [noteId]
        }
        const named: Array<NamedNode> = getInternalLinks(value).map(linkToURI)
        return named.length ? named : [getNamedNode(value)]
    }

    function getO(value: string) {
        const named: Array<NamedNode> = getInternalLinks(value).map(linkToURI)
        return named.length ? named : [rdf.literal(value)]
    }

    const quads: Array<Quad> = []

    for (const triple of triples) {

        const s: Array<NamedNode> = getSP(triple.subject)
        const p: Array<NamedNode> = getSP(triple.predicate)
        const o: Array<NamedNode | Literal> = getO(triple.object)

        for (const _s of s) {
            for (const _p of p) {
                for (const _o of o) {
                    quads.push(rdf.quad(_s, _p, _o))
                }
            }
        }

    }
    return new Dataset().addAll(quads)

}

export {getDotTriplesRDF}