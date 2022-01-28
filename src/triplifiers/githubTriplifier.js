import rdf from 'rdf-ext'
import { matchFirst } from './miniNLP.js'
import 'core-js/actual/index.js'

// const ns = {
//   schema: namespace('http://schema.org/'),
//   vault: namespace('http://vault.org/'),
//   rdf: namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
// }
const GITHUB_URL = 'https://github.com/'

class GithubTriplifier {

  constructor (docUri, ns) {
    if (!docUri || !ns) {
      throw Error('no namespaces defined')
    }
    this.docUri = docUri
    this.ns = ns
  }

  triplififyText (text) {
    const results = GithubTriplifier.getMatches(text)
    if (results && results[0].startsWith(GITHUB_URL)) {
      return this.getRDF(results[0])
    }
    return null
  }

  getRDF (repoUrl) {

    const [_, userName, repoName] = repoUrl.replaceAll('https://github.com', '').split('/')
    // https://github.com/cristianvasquez/prototype-11

    if (!userName) {
      return null
    }
    const dataset = rdf.dataset()
    const userUrl = `${GITHUB_URL}${userName}`
    const _vault = this.ns.vault
    const _rdf = this.ns.rdf

    dataset.addAll([
      rdf.quad(rdf.namedNode(userUrl), _rdf.type, _vault.GithubUser),
      rdf.quad(rdf.namedNode(userUrl), _vault.label, rdf.literal(userName)),
    ])

    if (repoName) {
      dataset.addAll([
        rdf.quad(rdf.namedNode(this.docUri), _vault.about, rdf.namedNode(repoUrl)),
        rdf.quad(rdf.namedNode(repoUrl), _rdf.type, _vault.GithubRepo),
        rdf.quad(rdf.namedNode(userUrl), _vault.has, rdf.namedNode(repoUrl)),
        rdf.quad(rdf.namedNode(repoUrl), _vault.label, rdf.literal(repoName)),
      ])
    }

    return dataset
  }

  static getMatches (text) {
    // <url> -> url
    const trim = (txt) => txt.split(' ')
      .map((chunk) => chunk.replace(/^\<+|\>+$/gm, ''))
      .join(' ')

    return matchFirst(trim(text), [
      'has github repo? [#Url]',
      'github repo [#Url]'
    ])
  }

}

export { GithubTriplifier }