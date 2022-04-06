import { ns } from './namespaces.js'
import { replaceInternalLinks } from './triplifiers/miniNLP.js'

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

function getCache (note, app) {
  const activePath = app.workspace.getActiveFile().path
  const noteMD = `${note}.md`
  return app.metadataCache.getFirstLinkpathDest(noteMD, activePath)
}

function getCurrentURI (app) {
  const uri =  pathToUri(app.workspace.getActiveFile().path)
  return `<${uri}>`
}

function replaceNotesToURIs (sparql, app) {

  sparql = sparql.replaceAll('__THIS__', getCurrentURI(app))

  return replaceInternalLinks(sparql, (str) => {
    const cache = getCache(str, app)
    const uri = cache?.path ? pathToUri(cache?.path) : `${str} NOT_FOUND`

    return `<${uri}>`
  })
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
  //   rows = dataset.map((quad)=>[quad.subject.value, quad.predicate.value, quad.object.value])
  for (const quad of dataset) {
    rows.push([quad.subject.value, quad.predicate.value, quad.object.value])
  }

  return {
    header: header,
    rows: rows
  }
}

const config = {
  pathToUri,
  uriToPath,
  selectToTable,
  datasetToTable,
  replaceNotesToURIs
}

export default config
