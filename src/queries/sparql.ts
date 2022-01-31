import {ns} from '../namespaces'

function shrink(iri: string) {
    const candidates = Array.from(Object.entries(ns)).filter(([_, value]) => {
        return iri.startsWith(value().value)
    })
    if (candidates.length) {
        candidates.sort(([, iri1], [, iri2]) => iri2.length - iri1.length)
        const found = candidates[0]
        return iri.replace(new RegExp(`^${found[1]().value}`), `${found[0]}:`)
    }
    return iri
}

function getPrefixes() {
    return Array.from(Object.entries(ns)).map(([key, value]) => `PREFIX ${key}: <${value().value}>`).join('\n')
}

function getSelectTemplate() {
    return `
\`\`\`sparql
${getPrefixes()}

SELECT ?g ?s ?p ?o
WHERE {
    GRAPH ?g {
       ?s ?p ?o .
    }
} LIMIT 10
\`\`\``
}

export {shrink, getPrefixes, getSelectTemplate}
