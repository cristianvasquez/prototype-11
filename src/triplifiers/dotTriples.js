// This should be done at some point with
// https://chevrotain.io/docs/ (if worth the effort)

import { getInternalLinks } from './miniNLP.js'
import { THIS } from '../consts.js'

function trim (txt) {
  return txt.replace(/^\s+|\s+$/gm, '')
}

function toSPO (text) {
  const chunks = text.split('::')
  if (chunks.length === 1) {
    return undefined
  } else if (chunks.length === 2) {
    return {
      raw: text,
      subject: {
        raw: THIS
      },
      predicate: {
        raw: chunks[0]
      },
      object: {
        raw: chunks[1]
      }
    }
  } else if (chunks.length === 3) {
    return {
      raw: text,
      subject: {
        raw: chunks[0]
      },
      predicate: {
        raw: chunks[1]
      },
      object: {
        raw: chunks[2]
      }
    }
  } else {
    return {
      raw: text,
      exception: 'ambiguous'
    }
  }
}

function setEntities (term, uriResolvers) {
  term.raw = trim(term.raw)

  const entities = []

  if (term.raw === THIS) {
    const { name, path, uri } = uriResolvers.getCurrentNote()
    entities.push({
      uri: uri,
      name: name
    })
    term.raw = `[[${name}]]`
  }

  for (const name of getInternalLinks(term.raw)) {
    entities.push({
      uri: uriResolvers.resolveURIByNoteName(name),
      name: name
    })
  }

  if (entities.length) {
    term.entities = entities
  }

  return term
}

function withEntities (triple, uriResolvers) {
  if (!triple.exception) {
    triple.subject = setEntities(triple.subject, uriResolvers)
    triple.predicate = setEntities(triple.predicate, uriResolvers)
    triple.object = setEntities(triple.object, uriResolvers)
  }
  return triple
}

function * getDotTriples (fullText) {

  const triples = fullText.split('\n').map(toSPO)
  for (const triple of triples) {
    if (triple) {
      yield triple
    }
  }
}

export { getDotTriples, toSPO, withEntities }