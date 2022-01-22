// This should be done at some point with
// https://chevrotain.io/docs/ (if worth the effort)

import { extract } from './miniNLP.js'
import { applyToChunks } from './utils.js'

//  (un :: (texto :: bonito))
const regexpSPO = /\(\s*([^)]+)\s*::\s*\(([^)]+)\s*::\s*([^)]+)\s*\)\)/g
//  un :: (texto :: bonito)
const regexpSPOnp = /([^\n\\)]+)\s*::\s*\(([^)]+)\s*::\s*([^)]+)\s*\)/g
// (texto :: bonito)
const regexpPO = /\(([^)]+)\s*::\s*([^)]+)\s*\)/g
// texto :: bonito
const regexpPOnp = /([^\n]+)::([^\n]+)/g

function trim (txt) {
  return txt.replace(/^\s+|\s+$/gm, '')
}

function toSPO (text) {
  const result = []

  // Matches SPO with parenthesis
  for (const match of text.matchAll(regexpSPO)) {
    result.push({
      subject: toTerm(match[1]),
      predicate: toTerm(match[2]),
      object: toTerm(match[3])
    })
  }
  text = text.replace(regexpSPO, '')

  // Matches SPO without parenthesis
  for (const match of text.matchAll(regexpSPOnp)) {
    result.push({
      subject: toTerm(match[1]),
      predicate: toTerm(match[2]),
      object: toTerm(match[3])
    })
  }
  text = text.replace(regexpSPOnp, '')

  // Matches PO with parenthesis
  for (const match of text.matchAll(regexpPO)) {
    result.push({
      predicate: toTerm(match[1]),
      object: toTerm(match[2])
    })
  }
  text = text.replace(regexpPO, '')

  // Matches PO without parenthesis
  for (const match of text.matchAll(regexpPOnp)) {
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
    entities: extract(value)
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