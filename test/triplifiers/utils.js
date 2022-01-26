import { shrink,getPrefixes } from '../../src/triplifiers/utils.js'

import expect from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'

expect.extend({ toMatchSnapshot })

describe('[utils]', function () {
  describe('[shrink]', function () {
    const phrases = [
      'http://vault.org/something',
      'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
      'http://www.not-me.com'
    ]
    phrases.forEach((current) => {
      it(`"${current}"`, function () {
        const actual = shrink(current)
        expect(actual).toMatchSnapshot(this)
      })
    })
  })

  describe('[prefixes]', function () {
    it(`"values"`, function () {
      const actual = getPrefixes()
      expect(actual).toMatchSnapshot(this)
    })
  })


})