import { ns } from '../namespaces.js'

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

export { pathToUri, uriToPath }
