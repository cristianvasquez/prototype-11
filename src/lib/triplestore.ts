import ParsingClient from "sparql-http-client/ParsingClient";
import Client from "sparql-http-client/ParsingClient";
import {Dataset} from '../types'
import rdf from 'rdf-ext'
import {ResultRow} from "sparql-http-client/ResultParser";
import {NamedNode} from "../types"

// const client: ParsingClient = new Client({
//     endpointUrl: 'http://localhost:3030/obsidian/query',
//     updateUrl: 'http://localhost:3030/obsidian/update',
//     user: '',
//     password: ''
// })

class Triplestore {
    private client: ParsingClient;

    constructor(client: Client) {
        this.client = client
    }

    async getDataset(graphUri: NamedNode) {
        const constructQuery = `
      CONSTRUCT {
        ?s ?p ?o
      } WHERE {
        GRAPH <${graphUri.value}> {
          ?s ?p ?o
        }
      }
      `
        return rdf.dataset(await this.client.query.construct(constructQuery))
    }

    async insertDataset(graphUri: NamedNode, dataset: Dataset) {
        const insertQuery = `
      INSERT DATA {
        GRAPH <${graphUri.value}> {
          ${dataset.toString()}
        }
      }
      `
        return await this.client.query.update(insertQuery)
    }

    async deleteDataset(graphUri: NamedNode) {
        const insertQuery = `
    DELETE {
      GRAPH <${graphUri.value}> {
       ?s ?p ?o
      }
    }
    WHERE {      
      GRAPH <${graphUri.value}> {
         ?s ?p ?o
      }
    } 
      `
        return await this.client.query.update(insertQuery)
    }

    async construct(query: string) {
        return rdf.dataset(await this.client.query.construct(query))
    }

    async select(query: string): Promise<Array<ResultRow>> {
        return this.client.query.select(query)
    }

}


export {Triplestore}