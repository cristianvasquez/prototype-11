import nlp from 'compromise'
import dates from 'compromise-dates'
import numbers from 'compromise-numbers'
import { LINKS_REGEXP } from './regexp.js'

nlp.extend(dates).extend(numbers)

const matchFirst = (text, patterns) => {

  const doc = nlp(text)
  for (let current of patterns) {
    const values = []
    const groups = doc.match(current).groups()
    for (const [key, value] of Object.entries(groups)) {
      values.push(value.text())
    }
    if (values.length > 0) {
      return values
    }
  }

  return undefined
}

function getInternalLinks (text) {
  const internalLinks = []
  for (const match of text.matchAll(LINKS_REGEXP)) {
    internalLinks.push(match[1].substring(2, match[1].length - 2))
  }
  return internalLinks
}

function replaceInternalLinks (text, replacer) {
  let result = text
  for (const current of getInternalLinks(text)) {
    result = result.replaceAll(`[[${current}]]`, replacer(current))
  }
  return result
}

// This thing is expensive!
// function getNLPstuff (text) {
//   const doc = nlp(text)
//   const dates = doc.dates().json()
//
//   let result = {}
//   if (dates.length) {
//     result.dates = dates
//   }
//
//   // @ts-ignore
//   const numbers = doc.numbers().json()
//   if (numbers.length) {
//     result.numbers = numbers
//   }
//
//   const internalLinks = getInternalLinks(text)
//   if (internalLinks.length) {
//     result.internalLinks = internalLinks
//   }
//   return result
// }

export {  getInternalLinks, replaceInternalLinks, matchFirst }