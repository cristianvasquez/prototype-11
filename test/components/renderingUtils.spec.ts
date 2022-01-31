import expect from 'expect'
import {getSpans} from '../../src/components/renderingUtils'
import {getInternalLinks} from '../../src/triplifiers/miniNLP'

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
                expect(actual).toMatchSnapshot()
            })
        })
    })
})