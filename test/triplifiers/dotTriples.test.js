import { getDotTriples } from '../../src/triplifiers/dotTriples.js'

import expect from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'

expect.extend({ toMatchSnapshot })


const phrases = [
  'properties :: and values are separated by double colons',
  `
  to simplify things, this
  mini-syntax :: spans
  only one line
  `,
  'Maria :: climbed :: the tree',
  'subject :: \'Quotes escape :: characters\' :: object',
  'internal link :: [[link]]',
  'is a :: [[Editor]], [[Jour]]',
  'external link :: <http://example.org>',
  'external link :: http://example.org',
  'date :: 2022-01-07 15:07',
  'arrays :: [banana, apple]',
  'A :: B :: C :: D',
  'vaccination dates :: 2022-01-07, next week',
  '__THIS__ :: is a :: note',
  ' something :: points at :: __THIS__',

  // '[Maria, Bob] :: (climbed :: the tree)',
  // '[Maria, Bob] :: ([climbed,looked at] :: the tree)',
  // '[Maria, Bob] :: ([climbed,looked at] :: [the tree, the sun])',
  // 'That night,  (Bob :: (ate :: all the pancakes)), and (we :: (are still :: surprised))',
  // 'Bob :: (has :: drivers license), (can drive :: true)',
]



describe('[getDotTriples]', function () {

  phrases.forEach((current)=>{
    it(`"${current}"`, async function () {

      let actual = []
      for (const triples of getDotTriples(current)) {
        actual = [...actual,...triples]
      }
      // console.debug(JSON.stringify(actual,null,2))
      expect(actual).toMatchSnapshot(this)
    })
  })

})