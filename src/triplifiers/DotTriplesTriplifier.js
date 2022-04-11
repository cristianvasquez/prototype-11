import rdf from 'rdf-ext'
import { ns } from '../namespaces.js'
import 'core-js/actual/index.js'
import { getDotTriplesFromText, withEntities } from './dotTriples.js'

function rawToURI (str) {

  if ('is-a' === str.toLowerCase()) {
    return ns.rdf.type
  }

  return rdf.namedNode(`http://props/${canonical(str)}`)
}

function toTermsSP (term) {
  if (term.entities) {
    return term.entities.map(term => term.uri)
  } else {
    return [rawToURI(term.raw)]
  }
}

function toTermsO (term) {
  if (term.entities) {
    return term.entities.map(term => term.uri)
  } else {
    return [rdf.literal(term.raw)]
  }
}

function canonical (str) {
  return str.toLowerCase().replaceAll(' ', '-')
}

class DotTriplesTriplifier {

  constructor (docUri, ns) {
    if (!docUri || !docUri.termType || docUri.termType !== 'NamedNode') {
      throw Error('no document URI defined')
    }
    if (!ns) {
      throw Error('no namespaces defined')
    }
    this.docUri = docUri
    this.ns = ns
  }

  triplififyText (text, uriResolvers) {
    const quads = []
    for (const dotTriple of getDotTriplesFromText(text)) {
      const triple = withEntities(dotTriple, uriResolvers)

      if (!triple.exception) {
        for (const s of toTermsSP(triple.subject)) {
          for (const p of toTermsSP(triple.predicate)) {
            for (const o of toTermsO(triple.object)) {
              quads.push(rdf.quad(s, p, o))
            }
          }
        }
      }

    }

    return rdf.dataset().addAll(quads)
  }

}

export { DotTriplesTriplifier, canonical, rawToURI }