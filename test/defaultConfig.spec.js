import {defaultConfig} from '../src/defaultConfig.js'

import expect from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'

expect.extend({ toMatchSnapshot })

describe('[uri]', function () {

  describe('[pathToUri]', function () {
    it(`"values"`, function () {
      const actual = defaultConfig.pathToUri('/hola/mundo')
      expect(actual).toMatchSnapshot(this)
    })
  })

  describe('[uriToPath]', function () {
    it(`"values"`, function () {
      const actual = defaultConfig.uriToPath('http://notes/L2hvbGEvbXVuZG8=')
      expect(actual).toMatchSnapshot(this)
    })
  })

  describe('[round]', function () {
    it(`"path-uri-path"`, function () {

      const uri = defaultConfig.pathToUri('/hola/mundo')
      const path = defaultConfig.uriToPath(uri)

      expect(path).toBe('/hola/mundo')
    })

    it(`"uri-path-uri"`, function () {

      const path = defaultConfig.uriToPath('http://notes/L2hvbGEvbXVuZG8=')
      const uri = defaultConfig.pathToUri(path)
      expect(uri.value).toBe('http://notes/L2hvbGEvbXVuZG8=')
    })

    it(`"emoji"`, function () {

      const uri = defaultConfig.pathToUri('/hola/🍎')
      const path = defaultConfig.uriToPath(uri)
      expect(path).toBe('/hola/🍎')
    })
  })

})