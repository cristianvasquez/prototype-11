import { getDotTriples } from '../../src/triplifiers/dotTriples.js'

import expect from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'

expect.extend({ toMatchSnapshot })


const phrases = [
  'properties :: and values are separated by double colons',
  'properties and values can be (embedded :: using parenthesis)',
  'Maria :: ( climbed :: the tree )',
  'suddenly, (Maria :: (climbed :: the tree)),',
  'That night,  (Bob :: (ate :: all the pancakes)), and (we :: (are still :: surprised))',
  'Bob :: (has :: drivers license), (can drive :: true)',
  `
  to simplify things, this
  mini-syntax :: spans
  only one line
  `,
  'arrays :: [banana, apple]',
  '[Maria, Bob] :: (climbed :: the tree)',
  '[Maria, Bob] :: ([climbed,looked at] :: the tree)',
  '[Maria, Bob] :: ([climbed,looked at] :: [the tree, the sun])',
  'external link :: <http://example.org>',
  'internal link :: [[link]]',
  'date :: 2022-01-07 15:07',
  'vaccination dates :: [2022-01-07, next week]',
  '(number :: twenty two) (number :: 22)',
  'A :: B :: C :: D',
]

describe('[getDotTriples]', function () {

  phrases.forEach((current)=>{
    it(`"${current}"`, function () {
      const actual = getDotTriples(current)
      // console.debug(JSON.stringify(actual,null,2))
      expect(actual).toMatchSnapshot(this)
    })
  })

})