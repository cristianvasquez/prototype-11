import rdf from 'rdf-ext'
import { matchPatterns } from './miniNLP.js'

/**
 ## URL patterns

 ```markdown
 has Github: <https://github.com/rdfjs-base/serializer-jsonld>
 ```

 ```turtle
 <https://github.com/rdfjs-base/serializer-jsonld> a :GithubRepo ;
 :label "serializer-jsonld" .
 <https://github.com/rdfjs-base> a :GithubUser ;
 :contains <https://github.com/rdfjs-base/serializer-jsonld> .
 ```
 **/


// const ns = {
//   schema: namespace('http://schema.org/'),
//   vault: namespace('http://vault.org/'),
//   rdf: namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
// }

// <url> -> url
const trim = (txt) => txt.split(' ')
  .map((chunk) => chunk.replace(/^\<+|\>+$/gm, ''))
  .join(' ')

function triplify (text, baseUri, ns) {

  const results = matchPatterns(trim(text), ['has github repo? [#Url]'])
  if (results) {
    const githubUrl = results[0]
    const repoName = githubUrl.split('/').at(-1)
    const githubUserUrl = githubUrl.split('/').slice(0, -1).join('/')
    const userName = githubUrl.split('/').at(-1)

    const dataset = rdf.dataset()

    dataset.addAll([
      rdf.quad(rdf.namedNode(baseUri), ns.vault.about, rdf.namedNode(githubUrl)),
      rdf.quad(rdf.namedNode(githubUserUrl), ns.vault.contains, rdf.namedNode(githubUrl)),
      rdf.quad(rdf.namedNode(githubUserUrl), ns.rdf.type, ns.vault.GithubUser),
      rdf.quad(rdf.namedNode(githubUserUrl), ns.vault.label, rdf.literal(userName)),
      rdf.quad(rdf.namedNode(githubUrl), ns.rdf.type, ns.vault.GithubRepo),
      rdf.quad(rdf.namedNode(githubUrl), ns.vault.label, rdf.literal(repoName)),
    ])
    return dataset
  }
  return null
}

export { triplify }