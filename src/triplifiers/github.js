import rdf from 'rdf-ext'
import { matchFirst } from './miniNLP.js'

// const ns = {
//   schema: namespace('http://schema.org/'),
//   vault: namespace('http://vault.org/'),
//   rdf: namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
// }

class GithubTriplifier {
  constructor(baseUri, ns) {
    this.baseUri = baseUri;
    this.ns = ns;
  }

  triplififyText (text) {
    const results = GithubTriplifier.getMatches(text)
    if (results) {
      return this.getRDF(results[0])
    }
    return null
  }

  getRDF (repoUrl) {
    const repoName = repoUrl.split('/').at(-1)
    const userUrl = repoUrl.split('/').slice(0, -1).join('/')
    const userName = repoUrl.split('/').at(-2)

    const dataset = rdf.dataset()

    const _vault = this.ns.vault
    const _rdf = this.ns.rdf

    dataset.addAll([
      rdf.quad(rdf.namedNode(this.baseUri), _vault.about, rdf.namedNode(repoUrl)),

      rdf.quad(rdf.namedNode(userUrl), _vault.contains, rdf.namedNode(repoUrl)),
      rdf.quad(rdf.namedNode(userUrl), _rdf.type, _vault.GithubUser),
      rdf.quad(rdf.namedNode(userUrl), _vault.label, rdf.literal(userName)),

      rdf.quad(rdf.namedNode(repoUrl), _rdf.type, _vault.GithubRepo),
      rdf.quad(rdf.namedNode(repoUrl), _vault.label, rdf.literal(repoName)),
    ])
    return dataset
  }

  static getMatches(text) {
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