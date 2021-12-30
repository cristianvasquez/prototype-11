type Dataset = {

};

const createClient = (app:any) => {
  const rdf = app.libs.rdf
  const SparqlClient = app.libs.client

  const client =  new SparqlClient({
    endpointUrl: 'http://localhost:3030/obsidian/query',
    updateUrl: 'http://localhost:3030/obsidian/update',
    user: '',
    password: ''
  })

  return {
    insert: (dataset:Dataset, graph:string) => {
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
    construct: async (query:string) => {
      return rdf.dataset(await client.query.construct(query))
    },
    select: async (query:string) => {
      return rdf.dataset(await client.query.select(query))
    },
    rdf:rdf,
    namespace:rdf.namespace,
    cf:rdf.clownface
  }
}


async function doSomething () {



  const ns = {
    schema: rdf.namespace('http://schema.org/'),
    rdf: rdf.namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
  }

  const data = rdf.clownface({ dataset: rdf.dataset(), term: rdf.namedNode('http://example.org/zazuko') })
    .addOut(ns.rdf.type, ns.schema.Organisation)
    .addOut(ns.rdf.name, 'Zazuko')

  await client.insert(data, 'http://example.org/main')

  const query = `
  CONSTRUCT {
      ?s ?p ?o
    } WHERE {
      GRAPH ?g {
        ?s ?p ?o
      }
   }`

  const result = await client.construct(query)
  console.log(result.toString())

}


export { createClient, doSomething }