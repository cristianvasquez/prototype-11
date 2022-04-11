import expect from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { DotTriplesTriplifier } from '../../src/triplifiers/DotTriplesTriplifier.js'
import { ns } from '../../src/namespaces.js'
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
]


function encodeURI (name) {
  return ns.this[btoa(unescape(encodeURIComponent(`http://${name}`)))]
}

describe('[triplififyText]', function () {

  const currentPath = 'CURRENT_NAME'
  const uriResolvers = {
    resolvePathByNoteName: (str) => `PATH_${str}`,
    resolveURIByNoteName: (str) => {
      return encodeURI(str)
    },
    getCurrentNote: () => {
      return {
        path: 'CURRENT_NAME',
        uri: encodeURI(currentPath),
        name: 'CURRENT_NAME'
      }
    },
  }

  const triplifier = new DotTriplesTriplifier(encodeURI(currentPath), ns)

  phrases.forEach((current) => {
    it(`"${current}"`, async function () {

      let actual = []
      for (const quad of triplifier.triplififyText(current, uriResolvers)) {
        actual.push(quad)
      }
      expect({
        size: actual.length,
        triples: actual,
      }).toMatchSnapshot(this)
    })
  })

})
