import {getInternalLinks} from '../../src/triplifiers/miniNLP'

describe('[miniNLP]', function () {
    describe('[getInternalLinks]', function () {
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
        phrases.forEach((current) => {
            it(`"${current}"`, function () {
                const actual = getInternalLinks(current)
                // console.debug(JSON.stringify(actual,null,2))
                expect(actual).toMatchSnapshot(this)
            })
        })
    })
})