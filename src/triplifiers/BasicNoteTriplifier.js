import rdf from 'rdf-ext'
import 'core-js/actual/index.js'

function getFileTitle (path) {
  if (path.includes('/')) path = path.substring(path.lastIndexOf('/') + 1)
  if (path.endsWith('.md')) path = path.substring(0, path.length - 3)
  return path
}

class BasicNoteTriplifier {

  constructor (docUri, ns) {
    if (!docUri || !ns) {
      throw Error('no namespaces defined')
    }
    this.docUri = docUri
    this.ns = ns
  }

  getRDF (metadataBase) {
    // Add all basic fields
    const data = rdf.clownface({ dataset: rdf.dataset(), term: this.docUri })
      .addOut(this.ns.rdf.type, this.ns.vault.Note)
      .addOut(this.ns.rdfs.label, getFileTitle(metadataBase.path))
      .addOut(this.ns.vault.path, metadataBase.path)
      .addOut(this.ns.vault.created, metadataBase.stat.ctime)
      .addOut(this.ns.vault.size, metadataBase.stat.size)

    if (metadataBase.stat.mtime) {
      data.addOut(this.ns.vault.modified, metadataBase.stat.mtime)
    }

    return data.dataset
  }

}

export { BasicNoteTriplifier }