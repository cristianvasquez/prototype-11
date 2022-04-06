import { GithubTriplifier } from '../../src/triplifiers/GithubTriplifier.js'
import rdf from 'rdf-ext'
import expect from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
expect.extend({ toMatchSnapshot })
import assert from 'assert'
import sinon from 'sinon'

const namespace = rdf.namespace
const docUri = rdf.namedNode('http://example/1')

const ns = {
  schema: namespace('http://schema.org/'),
  vault: namespace('http://vault.org/'),
  rdf: namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
}

describe('[GithubTriplifier]', function () {

  describe('[getMatches]', function () {
    const phrases = [
      'has Github repo <https://github.com/cristianvasquez/prototype-11>',
      'has github: <https://github.com/cristianvasquez/prototype-11>',
      'has Github: <https://github.com/cristianvasquez/prototype-11>',
      'github repo: <https://github.com/cristianvasquez/prototype-11>',
      'github repo: https://github.com/cristianvasquez/prototype-11',
      'github repo: https://another.website.com/cristianvasquez/prototype-11',

    ]
    phrases.forEach((current) => {
      it(`"${current}"`, function () {
        const actual = GithubTriplifier.getMatches(current)
        expect(actual).toMatchSnapshot(this)
      })
    })
  })
  describe('[getRDF]', function () {
    const phrases = [
      'https://github.com/cristianvasquez/prototype-11',
      'https://github.com/cristianvasquez',
      'https://github.com',
      'https://other.website.com/cristianvasquez',
    ]
    const triplifier = new GithubTriplifier(docUri,ns)

    phrases.forEach((current) => {
      it(`"${current}"`, function () {
        const dataset = triplifier.getRDF(current)
        expect(dataset?dataset.toString():'not triplified').toMatchSnapshot(this)
      })
    })
  })

  describe('[triplififyText]', function () {
    const phrases = [
      'https://github.com/cristianvasquez/prototype-11',
    ]
    phrases.forEach((current) => {
      it(`"${current}"`, function () {
        const triplifier = new GithubTriplifier(docUri,ns)
        const getRDFSpy = sinon.spy(triplifier, "getRDF");
        triplifier.triplififyText(`has Github repo ${current}`)
        assert(getRDFSpy.calledWith(current));
      })
    })
  })
})