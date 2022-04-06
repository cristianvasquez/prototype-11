import expect from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { getSpans } from '../../src/UI/components/renderingUtils.js'
import { getInternalLinks } from '../../src/triplifiers/miniNLP.js'

expect.extend({ toMatchSnapshot })

const phrases = [
  '[[b]]',
  'a [[b]] c',
  'a [[b]]',
  '[[b]] c',
  '[[a]] [[b]] [[a]]',
  'a [[b]] c [[d]] e [[b]] d',
  'a [[b]] c [[d]] e [[b]] d',
  '[[a | b]]',
]

describe('[renderingUtils]', function () {
  describe('[getSpans]', function () {
    phrases.forEach((current) => {
      it(`"${current}"`, function () {
        const actual = getSpans(current, getInternalLinks(current))
        console.debug(actual)
        expect(actual).toMatchSnapshot(this)
      })
    })
  })
})