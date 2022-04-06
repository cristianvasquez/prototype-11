// This should be done at some point with
// https://chevrotain.io/docs/ (if worth the effort)

import { getNLPstuff } from './miniNLP.js'
import { applyToChunks } from './utils.js'
import {
  SPO_REGEXP,
  SPOnp_REGEXP,
  PO_REGEXP,
  POnp_REGEXP
} from './regexp.js'

function trim (txt) {
  return txt.replace(/^\s+|\s+$/gm, '')
}

function toSPO (text) {
  const result = []

  // Matches SPO with parenthesis
  for (const match of text.matchAll(SPO_REGEXP)) {
    result.push({
      subject: toTerm(match[1]),
      predicate: toTerm(match[2]),
      object: toTerm(match[3])
    })
  }
  text = text.replace(SPO_REGEXP, '')

  // Matches SPO without parenthesis
  for (const match of text.matchAll(SPOnp_REGEXP)) {
    result.push({
      subject: toTerm(match[1]),
      predicate: toTerm(match[2]),
      object: toTerm(match[3])
    })
  }
  text = text.replace(SPOnp_REGEXP, '')

  // Matches PO with parenthesis
  for (const match of text.matchAll(PO_REGEXP)) {
    result.push({
      predicate: toTerm(match[1]),
      object: toTerm(match[2])
    })
  }
  text = text.replace(PO_REGEXP, '')

  // Matches PO without parenthesis
  for (const match of text.matchAll(POnp_REGEXP)) {
    result.push({
      predicate: toTerm(match[1]),
      object: toTerm(match[2])
    })
  }
  return result
}

function toTerm (value) {
  const trimmed = trim(value)
  const tryArray = trimmed.split(',')
  if (tryArray.length > 1
    && trimmed.startsWith('[')
    && trimmed.endsWith(']')) {
    return {
      value: trimmed.slice(1, -1).split(',').map(toTerm),
    }
  }

  return {
    value: trimmed,
    entities: getNLPstuff(value)
  }
}

function * getDotTriples (text) {
  for (const triples of applyToChunks(text, toSPO)) {
    if (triples) {
      yield triples
    }
  }
}

export { getDotTriples, toSPO }