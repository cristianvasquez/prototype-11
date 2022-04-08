import { ns } from './namespaces.js'
import { replaceInternalLinks } from './triplifiers/miniNLP.js'
import { THIS } from './consts.js'

// returns: NamedNode
function encodeURI (path) {
  return ns.this[btoa(unescape(encodeURIComponent(path)))]
}

// Expects string of Named node
function uriToPath (uri) {
  const str = (typeof uri === 'string' || uri instanceof String) ? uri : uri.value
  const coding = str.replace(new RegExp(`^${ns.this()}`), '')
  return decodeURIComponent(escape(atob(coding)))
}

function uriResolvers (app) {

  function getObsidianCache (note, app) {
    const activePath = app.workspace.getActiveFile().path
    const noteMD = `${note}.md`
    return app.metadataCache.getFirstLinkpathDest(noteMD, activePath)
  }

  return {
    resolvePathByNoteName: (str) => {
      const cache = getObsidianCache(str, app)
      return cache?.path
    },
    resolveURIByNoteName: (str) => {
      const cache = getObsidianCache(str, app)
      return encodeURI(cache?.path)

    },
    getCurrentURI: () => {
      return encodeURI(app.workspace.getActiveFile().path)
    }
  }

}

function replaceSPARQL (sparql, uriResolvers) {

  if (sparql.includes(THIS)) {
    sparql = sparql.replaceAll(THIS, `<${uriResolvers.getCurrentURI()}>`)
  }

  const replacer = (str) => {
    const path = uriResolvers.resolvePathByNoteName(str)
    return path ? `<${encodeURI(path)}>` : `[${str} NOT_FOUND]`
  }

  return replaceInternalLinks(sparql, replacer)
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
  encodeURI,
  uriToPath,
  selectToTable,
  datasetToTable,
  replaceSPARQL
}

export { config, uriResolvers }
