import { config, uriResolvers } from '../src/config.js'

import expect from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'

expect.extend({ toMatchSnapshot })

describe('[uri]', function () {

  describe('[encodeURI]', function () {
    it(`"values"`, function () {
      const actual = config.encodeURI('/hola/mundo')
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

      const uri = config.encodeURI('/hola/mundo')
      const path = config.uriToPath(uri)

      expect(path).toBe('/hola/mundo')
    })

    it(`"uri-path-uri"`, function () {

      const path = config.uriToPath('http://notes/L2hvbGEvbXVuZG8=')
      const uri = config.encodeURI(path)
      expect(uri.value).toBe('http://notes/L2hvbGEvbXVuZG8=')
    })

    it(`"emoji"`, function () {

      const uri = config.encodeURI('/hola/🍎')
      const path = config.uriToPath(uri)
      expect(path).toBe('/hola/🍎')
    })

    it(`"undefined"`, function () {

      const uri = config.encodeURI(undefined)
      const path = config.uriToPath(uri)
      expect(path).toBe("undefined")
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

      const uriResolvers = {
        resolvePathByNoteName: (str) => 'PATH_RESOLVED',
        getCurrentURI: () => {
          return config.encodeURI('/hola/')
        }
      }

      const actual = config.replaceSPARQL(query,uriResolvers)
      expect(actual).toMatchSnapshot(this)
    })

    it(`"__THIS__ preprocessing"`, function () {

      const query = `SELECT ?g ?p ?o
        WHERE {
            GRAPH ?g {
               __THIS__ ?p ?o .
            }
        } LIMIT 10`

      const uriResolvers = {
        resolvePathByNoteName: (str) => 'PATH_RESOLVED',
        getCurrentURI: () => {
          return config.encodeURI('/hola/')
        }
      }

      const actual = config.replaceSPARQL(query,uriResolvers)
      expect(actual).toMatchSnapshot(this)
    })


  })

})