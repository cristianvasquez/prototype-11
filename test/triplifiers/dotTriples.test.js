import { getDotTriplesFromText, withEntities } from '../../src/triplifiers/dotTriples.js'

import expect from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'

expect.extend({ toMatchSnapshot })

const phrases = [
  'properties :: and values are separated by double colons',
  `
  to simplify things, each
  property :: value
  spans one line
  `,
  `
  a :: b
  c :: d  
  `,
  `
  a :: b
  a :: b  
  `,
  `a :: h
a :: i
a :: i`,
  'Maria :: climbed :: the tree',
  'subject :: \'Quotes escape :: characters\' :: object',
  'internal link :: [[link]]',
  'is a :: [[Editor]], [[Jour]]',
  'external link :: <http://example.org>',
  'external link :: http://example.org',
  'date :: 2022-01-07 15:07',
  'A :: B :: C :: D',
  'vaccination dates :: 2022-01-07, next week',
  '[[Note]] :: is a :: note',
  ' something :: points at :: [[Note]]',
  '__THIS__ :: is a :: note',
  ' something :: points at :: __THIS__',

  // '[Maria, Bob] :: (climbed :: the tree)',
  // '[Maria, Bob] :: ([climbed,looked at] :: the tree)',
  // '[Maria, Bob] :: ([climbed,looked at] :: [the tree, the sun])',
  // 'That night,  (Bob :: (ate :: all the pancakes)), and (we :: (are still :: surprised))',
  // 'Bob :: (has :: drivers license), (can drive :: true)',
]

describe('[getDotTriples]', function () {

  phrases.forEach((current) => {
    it(`"${current}"`, async function () {

      let actual = []
      for (const triple of getDotTriplesFromText(current)) {
        actual = [...actual, triple]
      }
      // console.debug(JSON.stringify(actual,null,2))
      expect({
        size:actual.length,
        triples:actual,
      }).toMatchSnapshot(this)
    })
  })

})

describe('[getDotTriples withEntities]', function () {

  const uriResolvers = {
    resolvePathByNoteName: (str) => `${str}_PATH`,
    resolveURIByNoteName: (str) => `${str}_URI`,
    getCurrentNote: () => {
      return {
        path: 'CURRENT_PATH',
        uri: 'CURRENT_URI',
        name: 'CURRENT_NAME'
      }
    },
  }
  phrases.forEach((current) => {
    it(`"${current}"`, async function () {

      let actual = []
      for (const triple of getDotTriplesFromText(current)) {
        actual = [...actual, withEntities(triple, uriResolvers)]
      }
      // console.debug(JSON.stringify(actual,null,2))
      expect({
        size:actual.length,
        triples:actual,
      }).toMatchSnapshot(this)
    })
  })

})

describe('[getDotTriples withEntities not found]', function () {

  const uriResolvers = {
    resolvePathByNoteName: (str) => undefined,
    resolveURIByNoteName: (str) => undefined,
    getCurrentNote: () => {
      return {
        path: 'CURRENT_PATH',
        uri: 'CURRENT_URI',
        name: 'CURRENT_NAME'
      }
    },
  }
  phrases.forEach((current) => {
    it(`"${current}"`, async function () {

      let actual = []
      for (const triple of getDotTriplesFromText(current)) {
        actual = [...actual, withEntities(triple, uriResolvers)]
      }
      // console.debug(JSON.stringify(actual,null,2))
      expect({
        size:actual.length,
        triples:actual,
      }).toMatchSnapshot(this)
    })
  })

})
