import {ID_PROPERTY} from "../consts";
import {getFileTitle} from "./normalize";

const createBuilder = (app: any) => {
    const rdf = app.libs.rdf // Environment
    const cf = rdf.clownface
    const namespace = rdf.namespace

    const ns = {
        schema: namespace('http://schema.org/'),
        vault: namespace('http://vault.org/'),
        rdf: namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
    }

    const mapping: { [key: string]: string; } = {
        'is-a': ns.rdf.type
    }

    const isFile = (value: any) => value.type === 'file'

    function uriFactory(path: string) {
        const encoded = encodeURI(path);
        return `http://data.org/${encoded}`
    }

    return {
        uriFactory:uriFactory,
        metadataToRDF: (metadataBase: any, fields: any) => {

            const id = fields.get(ID_PROPERTY)
            if (null == id) {
                throw new Error(`${metadataBase.path} has no ${ID_PROPERTY} property`)
            }

            const uri = uriFactory(metadataBase.path)

            // Add all basic fields
            const data = cf({dataset: rdf.dataset(), term: rdf.namedNode(uri)})
                .addOut(ns.rdf.type, ns.vault.Note)
                .addOut(ns.rdf.name, getFileTitle(metadataBase.path))
                .addOut(ns.vault.path, metadataBase.path)
                .addOut(ns.vault.created, metadataBase.ctime.toString())
                .addOut(ns.vault.size, metadataBase.size)

            if (metadataBase.mtime) {
                data.addOut(ns.vault.modified, metadataBase.mtime.toString())
            }

            // Add all arbitrary fields
            for (const [key, value] of fields) {
                const resolveTargetUri = (path: string) => {
                    const targetPath = app.metadataCache.getFirstLinkpathDest(path, metadataBase.path).path
                    return rdf.namedNode(uriFactory(targetPath))
                }
                const property = mapping[key] ? mapping[key] : ns.vault(key.toString())
                const object = isFile(value) ? resolveTargetUri(value.path) : value.toString()
                data.addOut(property, object)
            }

            return data
        },

    }
}

export {createBuilder}