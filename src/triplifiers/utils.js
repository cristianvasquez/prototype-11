import { ns } from '../namespaces.js'

// Poor's man iterator
function * applyToChunks (text, func, char = '\n') {
  if (text.indexOf(char) !== -1) {
    let i = 0
    let j = 0
    while ((j = text.indexOf(char, i)) !== -1) {
      const line = text.substring(i, j)
      yield func(line)
      i = j + 1
    }
  } else {
    yield func(text)
  }
}

function shrink (iri) {
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

function getPrefixes () {
  return Array.from(Object.entries(ns)).map(([key, value]) => `PREFIX ${key}: <${value().value}>`).join('\n')
}

function getTemplate () {
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

export { applyToChunks, shrink, getPrefixes, getTemplate }