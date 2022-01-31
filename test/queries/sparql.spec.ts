import { getPrefixes, getSelectTemplate, shrink } from '../../src/queries/sparql'
import expect from 'expect'

describe('[sparql]', function () {

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

  describe('[templates]', function () {
    it(`"prefixes"`, function () {
      const actual = getPrefixes()
      expect(actual).toMatchSnapshot(this)
    })
    it(`"template"`, function () {
      const actual = getSelectTemplate()
      expect(actual).toMatchSnapshot(this)
    })
  })

})