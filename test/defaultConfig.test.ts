import {defaultConfig} from '../src/defaultConfig'
import rdf from 'rdf-ext'
import {TFile} from "obsidian";

function getTFile(basename: string): TFile {
    return {
        extension: "", name: "", parent: undefined, path: "", stat: undefined, vault: undefined,
        basename: basename
    }
}

describe('[uri]', function () {

    describe('[noteNameToURI]', function () {
        it(`"values"`, function () {
            const tfile = getTFile('/hola/mundo')

            const actual = defaultConfig.tFileToURI(tfile)
            expect(actual).toMatchSnapshot()
        })
    })

    describe('[noteNameToPath]', function () {
        it(`"values"`, function () {
            const actual = defaultConfig.uriToNoteName(rdf.namedNode('http://notes/L2hvbGEvbXVuZG8='))
            expect(actual).toMatchSnapshot(this)
        })
    })

    describe('[round]', function () {
        it(`"name-noteName-path"`, function () {
            const tfile = getTFile('/hola/mundo')

            const uri = defaultConfig.tFileToURI(tfile)
            const noteName = defaultConfig.uriToNoteName(uri)
            expect(noteName).toBe(tfile)
        })

        it(`"noteName-name-uri"`, function () {
            const noteName: string = defaultConfig.uriToNoteName(rdf.namedNode('http://notes/L2hvbGEvbXVuZG8='))
            const uri = defaultConfig.tFileToURI(getTFile(noteName))
            expect(uri.value).toBe('http://notes/L2hvbGEvbXVuZG8=')
        })

        it(`"emoji"`, function () {
            const tfile = getTFile('/hola/🍎')
            const uri = defaultConfig.tFileToURI(tfile)
            const path = defaultConfig.uriToNoteName(uri)
            expect(path).toBe(tfile)
        })
    })

//   describe('[replaceInternalLinks]', function () {
//     it(`"replace"`, function () {
//       const sparql = `
// SELECT ?g ?s ?p ?o
// WHERE {
//     GRAPH ?g {
//        [[Subject]] ?p [[Category]] .
//     }
// } LIMIT 10
//       `
//       const actual = defaultConfig.replaceInternalLinks(sparql)
//       expect(actual).toMatchSnapshot(this)
//     })
//   })

})