import ParsingClient from "sparql-http-client/ParsingClient";
import DatasetExt from "rdf-ext/lib/Dataset";

const createClient = (app: any) => {
    const rdf_lib = app.libs.rdf // Environment
    const Client = app.libs.client
    const client: ParsingClient = new Client({
        endpointUrl: 'http://localhost:3030/obsidian/query',
        updateUrl: 'http://localhost:3030/obsidian/update',
        user: '',
        password: ''
    })

    console.log(rdf_lib)
    return {
        insert: (dataset: DatasetExt, graph: string) => {
            const insertQuery = `
      INSERT DATA {
        GRAPH <${graph}> {
          ${dataset.toString()}
        }
      }
      `
            console.log(insertQuery)
            return client.query.update(insertQuery)
        },
        construct: async (query: string) => {
            return rdf_lib.dataset(await client.query.construct(query))
        },
        select: async (query: string) => {
            return rdf_lib.dataset(await client.query.select(query))
        },
        rdf: rdf_lib,
        namespace: rdf_lib.namespace,
        cf: rdf_lib.clownface
    }
}

export {createClient}