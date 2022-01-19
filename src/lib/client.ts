import ParsingClient from "sparql-http-client/ParsingClient";
import Dataset from "rdf-ext/lib/Dataset";
import rdf from 'rdf-ext'
import Client from 'sparql-http-client/ParsingClient'
import {ResultRow} from "sparql-http-client/ResultParser";

const client: ParsingClient = new Client({
    endpointUrl: 'http://localhost:3030/obsidian/query',
    updateUrl: 'http://localhost:3030/obsidian/update',
    user: '',
    password: ''
})

async function getDataset(graphUri: string) {
    const constructQuery = `
      CONSTRUCT {
        ?s ?p ?o
      } WHERE {
        GRAPH <${graphUri}> {
          ?s ?p ?o
        }
      }
      `
    return rdf.dataset(await client.query.construct(constructQuery))
}

async function insertDataset(graphUri: string, dataset: Dataset) {
    const insertQuery = `
      INSERT DATA {
        GRAPH <${graphUri}> {
          ${dataset.toString()}
        }
      }
      `
    return await client.query.update(insertQuery)
}

async function deleteDataset(graphUri: string) {
    const insertQuery = `
    DELETE {
      GRAPH <${graphUri}> {
       ?s ?p ?o
      }
    }
    WHERE {      
      GRAPH <${graphUri}> {
         ?s ?p ?o
      }
    } 
      `
    return await client.query.update(insertQuery)
}

async function construct(query: string) {
    return rdf.dataset(await client.query.construct(query))
}

async function select(query: string): Promise<Array<ResultRow>> {
    return await client.query.select(query)
}

export {getDataset, insertDataset, deleteDataset, select, construct}