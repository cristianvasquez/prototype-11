// This should be done at some point with
// https://chevrotain.io/docs/ (if worth the effort)

import { extract } from './miniNLP.js'
import { chunksToLinesAsync, chomp } from '@rauschma/stringio'
import { Readable } from 'stream'

//  (un :: (texto :: bonito))
const regexpSPO = /\(\s*([^\)]+)\s*::\s*\(([^\)]+)\s*::\s*([^\)]+)\s*\)\)/g
//  un :: (texto :: bonito)
const regexpSPOnp = /([^\n\(\)]+)\s*::\s*\(([^\)]+)\s*::\s*([^\)]+)\s*\)/g
// (texto :: bonito)
const regexpPO = /\(([^\)]+)\s*::\s*([^\)]+)\s*\)/g
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

import split from 'binary-split'

function splitTest (matcher, cb) {
  if (!cb) {
    cb = matcher
    matcher = undefined
  }
  var splitter = split(matcher)
  var items = []
  splitter.on('data', function (item) {
    items.push(item)
  })
  splitter.on('error', function (e) {
    cb(e)
  })
  splitter.on('end', function () {
    cb(null, items)
  })
  return splitter
}

function * getDotTriples (text) {
  // Poor's man line iterator
  const char = '\n'
  if (text.indexOf(char) !== -1) {
    let i = 0
    let j = 0
    while ((j = text.indexOf(char, i)) !== -1) {
      const line = text.substring(i, j)
      yield toSPO(line)
      i = j + 1
    }
  } else {
    yield toSPO(text)
  }

}

export { getDotTriples, toSPO }