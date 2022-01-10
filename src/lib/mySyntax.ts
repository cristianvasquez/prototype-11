// This should be done at some point with
// https://chevrotain.io/docs/

import {Triple, Term, TermKind} from "../types";
import {DateTime} from "luxon";


const getTriples = (text: string): Array<Triple> => {


    //  (un :: (texto :: bonito))
    const regexpSPO = /\(\s*([^\)]+)\s*::\s*\(([^\)]+)\s*::\s*([^\)]+)\s*\)\)/g
    //  un :: (texto :: bonito)
    const regexpSPOnp = /([^\(\)]+)\s*::\s*\(([^\)]+)\s*::\s*([^\)]+)\s*\)/g
    // (texto :: bonito)
    const regexpPO = /\(([^\)]+)\s*::\s*([^\)]+)\s*\)/g
    // texto :: bonito
    const regexpPOnp = /([^\n]+)::([^\n]+)/g

    const result = []

    function trim(txt: string) {
        return txt.replace(/^\s+|\s+$/gm, '');
    }

    function toTerm(value: string): Term {
        const trimmed = trim(value)


        const tryArray = trimmed.split(',')
        if (tryArray.length > 1
            && trimmed.startsWith('[')
            && trimmed.endsWith(']')) {
            return {
                value: trimmed.slice(1, -1).split(',').map(toTerm),
                type: TermKind.Array
            }
        } else if (trimmed.startsWith('[[') && trimmed.endsWith(']]')){
            return {
                value: trimmed,
                type: TermKind.InternalLink
            }
        } else if (trimmed.startsWith('<http') && trimmed.endsWith('>')){
            return {
                value: trimmed,
                type: TermKind.ExternalLink
            }
        } else if (trimmed.startsWith('#')){
            return {
                value: trimmed,
                type: TermKind.Tag
            }
        }

        const tryDate = DateTime.fromSQL(trimmed)
        if (tryDate.isValid){
            return {
                value: tryDate,
                type: TermKind.LiteralDate
            }
        }


        return {
            value: trimmed
        }
    }

    for (let line of text.split('\n')) {

        // Matches SPO with parenthesis
        for (const match of line.matchAll(regexpSPO)) {
            result.push({
                subject: toTerm(match[1]),
                predicate: toTerm(match[2]),
                object: toTerm(match[3])
            })
        }
        line = line.replace(regexpSPO, '')

        // Matches SPO without parenthesis
        for (const match of line.matchAll(regexpSPOnp)) {
            result.push({
                subject: toTerm(match[1]),
                predicate: toTerm(match[2]),
                object: toTerm(match[3])
            })
        }
        line = line.replace(regexpSPOnp, '')

        // Matches PO with parenthesis
        for (const match of line.matchAll(regexpPO)) {
            result.push({
                predicate: toTerm(match[1]),
                object: toTerm(match[2])
            })
        }
        line = line.replace(regexpPO, '')

        // Matches PO without parenthesis
        for (const match of line.matchAll(regexpPOnp)) {
            result.push({
                predicate: toTerm(match[1]),
                object: toTerm(match[2])
            })
        }
        line = line.replace(regexpPOnp, '')

    }

    return result
}


export {getTriples}