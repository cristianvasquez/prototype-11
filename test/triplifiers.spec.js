import { triplify } from '../src/triplifiers/github.js'
import rdf from 'rdf-ext'
import expect from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import assert from 'assert'
expect.extend({ toMatchSnapshot })

const namespace = rdf.namespace
const baseUri = 'http://example/1'

const ns = {
  schema: namespace('http://schema.org/'),
  vault: namespace('http://vault.org/'),
  rdf: namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
}

describe('Github', function () {
  describe('has Github repo', function () {
    it('has Github repo', function () {

      const content = `
   has Github repo <https://github.com/cristianvasquez/prototype-11>
`
      assert.notEqual(triplify(content, baseUri, ns), null, 'should return a dataset')
      expect(triplify(content, baseUri, ns).toString()).toMatchSnapshot(this)
    })

    it('has Github', function () {

      const content = `
   has Github <https://github.com/cristianvasquez/prototype-11>
`
      assert.notEqual(triplify(content, baseUri, ns), null, 'should return a dataset')
      expect(triplify(content, baseUri, ns).toString()).toMatchSnapshot(this)
    })

  })
})
