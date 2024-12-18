# Prototype 11

Allows to index and query your Notes' RDF from Obsidian. 

Status: exploration

## Collecting RDF

Each time you save a file, RDF triples are extracted and indexed in the triplestore.

When saving the file, the triples are indexed in the triplestore.

There is a debug panel to lookup the triples.

![alice.png](./assets/alice.png)

## Queries

Prototype-11 uses a dialect of SPARQL that allows to embed references to markdown notes.

You can use them in sparql code-block like this:

```sparql
SELECT ?g ?p ?o WHERE {
 GRAPH ?g {
		 [[Alice]] ?p ?o
	 }
} LIMIT 6
```

Such code-blocks are then rendered inline, and will contain clickable links in case of known entities. 

![query-results.png](./assets/query-results.png)

## Config

Setup your triplestore in the options menu

![config.png](./assets/config.png)