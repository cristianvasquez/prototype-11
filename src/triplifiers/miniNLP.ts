import nlp from 'compromise'
import dates from 'compromise-dates'
import numbers from 'compromise-numbers'
import {LINKS_REGEXP} from '../lib/regexp'

nlp.extend(dates).extend(numbers)

const matchFirst = (text: string, patterns: Array<string>) => {

    const doc = nlp(text)
    for (let current of patterns) {
        const values = []
        const groups = doc.match(current).groups()
        for (const [key, value] of Object.entries(groups)) {
            values.push(value.text())
        }
        if (values.length > 0) {
            return values
        }
    }

    return undefined
}

function getInternalLinks(text: string) {
    const internalLinks = []
    for (const match of text.matchAll(LINKS_REGEXP)) {
        internalLinks.push(match[1])
    }
    return internalLinks
}

function extract(text: string) {
    const doc = nlp(text)
    // @ts-ignore
    const dates = doc.dates().json()

    let result = {}
    if (dates.length) {
        // @ts-ignore
        result.dates = dates
    }

    // @ts-ignore
    const numbers = doc.numbers().json()
    if (numbers.length) {
        // @ts-ignore
        result.numbers = numbers
    }

    const internalLinks = getInternalLinks(text)
    if (internalLinks.length) {
        // @ts-ignore
        result.internalLinks = internalLinks
    }
    return result
}

export {extract, getInternalLinks, matchFirst}