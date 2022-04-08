// This should be done at some point with
// https://chevrotain.io/docs/ (if worth the effort)

import { applyToChunks } from './utils.js'
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
    entities.push({
      type: 'uri',
      value: uriResolvers.getCurrentURI()
    })
  }

  for (const current of getInternalLinks(term.raw)) {
    entities.push({
      type: 'uri',
      value: uriResolvers.resolveURIByNoteName(current)
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
  for (const triple of applyToChunks(fullText, toSPO)) {
    if (triple) {
      yield triple
    }
  }
}

export { getDotTriples, toSPO, withEntities }