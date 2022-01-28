import { uriToPath,pathToUri } from '../../src/triplifiers/uri.js'

import expect from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'

expect.extend({ toMatchSnapshot })

describe('[uri]', function () {

  describe('[pathToUri]', function () {
    it(`"values"`, function () {
      const actual = pathToUri('/hola/mundo')
      expect(actual).toMatchSnapshot(this)
    })
  })

  describe('[uriToPath]', function () {
    it(`"values"`, function () {
      const actual = uriToPath('http://notes/L2hvbGEvbXVuZG8=')
      expect(actual).toMatchSnapshot(this)
    })
  })

  describe('[round]', function () {
    it(`"path-uri-path"`, function () {

      const uri = pathToUri('/hola/mundo')
      const path = uriToPath(uri)

      expect(path).toBe('/hola/mundo')
    })

    it(`"uri-path-uri"`, function () {

      const path = uriToPath('http://notes/L2hvbGEvbXVuZG8=')
      const uri = pathToUri(path)
      expect(uri.value).toBe('http://notes/L2hvbGEvbXVuZG8=')
    })

    it(`"emoji"`, function () {

      const uri = pathToUri('/hola/🍎')
      const path = uriToPath(uri)
      expect(path).toBe('/hola/🍎')
    })
  })


})