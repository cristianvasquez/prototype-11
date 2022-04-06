import config from '../src/config.js'

import expect from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'

expect.extend({ toMatchSnapshot })

describe('[uri]', function () {

  describe('[pathToUri]', function () {
    it(`"values"`, function () {
      const actual = config.pathToUri('/hola/mundo')
      expect(actual).toMatchSnapshot(this)
    })
  })

  describe('[uriToPath]', function () {
    it(`"values"`, function () {
      const actual = config.uriToPath('http://notes/L2hvbGEvbXVuZG8=')
      expect(actual).toMatchSnapshot(this)
    })
  })

  describe('[round]', function () {
    it(`"path-uri-path"`, function () {

      const uri = config.pathToUri('/hola/mundo')
      const path = config.uriToPath(uri)

      expect(path).toBe('/hola/mundo')
    })

    it(`"uri-path-uri"`, function () {

      const path = config.uriToPath('http://notes/L2hvbGEvbXVuZG8=')
      const uri = config.pathToUri(path)
      expect(uri.value).toBe('http://notes/L2hvbGEvbXVuZG8=')
    })

    it(`"emoji"`, function () {

      const uri = config.pathToUri('/hola/🍎')
      const path = config.uriToPath(uri)
      expect(path).toBe('/hola/🍎')
    })
  })

  describe('[sparql preprocessor]', function () {
    it(`"basic preprocessing"`, function () {

      const query = `SELECT ?g ?p ?o
        WHERE {
            GRAPH ?g {
               [[/hola/mundo]] ?p ?o .
            }
        } LIMIT 10`

      const actual = config.sparqlPreprocessor(query)
      expect(actual).toMatchSnapshot(this)
    })


  })

})