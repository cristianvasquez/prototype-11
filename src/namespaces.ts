import namespace from '@rdfjs/namespace'
import {VAULT_NAMESPACE} from './config'

const ns = {
    schema: namespace('http://schema.org/'),
    vault: namespace('http://vault.org/'),
    rdf: namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
    rdfs: namespace('http://www.w3.org/2000/01/rdf-schema#'),
    this: namespace(VAULT_NAMESPACE)
}

export {ns}