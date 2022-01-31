import rdf from 'rdf-ext'
import {matchFirst} from './miniNLP'
import 'core-js/actual/index'
import NamedNode from "rdf-ext/lib/NamedNode";

// const ns = {
//   schema: namespace('http://schema.org/'),
//   vault: namespace('http://vault.org/'),
//   rdf: namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
// }
const GITHUB_URL = 'https://github.com/'

class GithubTriplifier {
    private readonly docUri: NamedNode;
    private ns: any;

    constructor(docUri: NamedNode, ns: any) {
        if (!docUri.value) {
            throw Error('no URI defined')
        }
        if (!ns) {
            throw Error('no namespaces defined')
        }
        this.docUri = docUri
        this.ns = ns
    }

    static getMatches(text: string) {
        // <url> -> url
        const trim = (txt: string) => txt.split(' ')
            .map((chunk) => chunk.replace(/^\<+|\>+$/gm, ''))
            .join(' ')

        return matchFirst(trim(text), [
            'has github repo? [#Url]',
            'github repo [#Url]'
        ])
    }

    triplififyText(text: string) {
        const results = GithubTriplifier.getMatches(text)
        if (results && results[0].startsWith(GITHUB_URL)) {
            return this.getRDF(results[0])
        }
        return null
    }

    getRDF(repoUrl: string) {

        // @ts-ignore
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
                rdf.quad(this.docUri, _vault.about, rdf.namedNode(repoUrl)),
                rdf.quad(rdf.namedNode(repoUrl), _rdf.type, _vault.GithubRepo),
                rdf.quad(rdf.namedNode(userUrl), _vault.has, rdf.namedNode(repoUrl)),
                rdf.quad(rdf.namedNode(repoUrl), _vault.label, rdf.literal(repoName)),
            ])
        }

        return dataset
    }

}

export {GithubTriplifier}