import { ns } from './namespaces.js'

// Things that can be configured, but only by a power user.

// returns: NamedNode
function pathToUri (path) {
  return ns.this[btoa(unescape(encodeURIComponent(path)))]
}

// Expects string of Named node
function uriToPath (uri) {
  const str = (typeof uri === 'string' || uri instanceof String) ? uri : uri.value
  const coding = str.replace(new RegExp(`^${ns.this()}`), '')
  return decodeURIComponent(escape(atob(coding)))
}

function selectToTable (sparqlSelectResult) {
  let header = null
  let rows = []
  for (const current of sparqlSelectResult) {
    if (!header) {
      header = Object.keys(current)
    }
    rows.push(Object.values(current).map((current) => current.value))
  }
  return {
    header: header,
    rows: rows
  }
}

function datasetToTable (dataset) {
  let header = ['subject', 'predicate', 'object']
  let rows = []
  // Map does not work?
  //   rows = dataset.toArray().map((quad)=>[quad.subject.value, quad.predicate.value, quad.object.value])
  for (const quad of dataset) {
    rows.push([quad.subject.value, quad.predicate.value, quad.object.value])
  }

  return {
    header: header,
    rows: rows
  }
}

const defaultConfig = {
  pathToUri,
  uriToPath,
  selectToTable,
  datasetToTable
}

export { defaultConfig }
