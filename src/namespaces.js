import rdf from 'rdf-ext'

const ns = {
  // @ts-ignore
  schema: rdf.namespace('http://schema.org/'),
  // @ts-ignore
  vault: rdf.namespace('http://vault.org/'),
  // @ts-ignore
  rdf: rdf.namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
}

export {ns}