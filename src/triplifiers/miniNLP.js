import nlp from 'compromise'
import dates from 'compromise-dates'
import numbers from 'compromise-numbers'

nlp.extend(dates).extend(numbers)

const linksRegexp = /\[\[([^\]\n]*)\]\]/g

const matchPatterns = (text, patterns) => {

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

function extract (text) {
  const doc = nlp(text)
  const dates = doc.dates().json()

  let result = {}
  if (dates.length) {
    result.dates = dates
  }

  // @ts-ignore
  const numbers = doc.numbers().json()
  if (numbers.length) {
    result.numbers = numbers
  }

  const internalLinks = []
  for (const match of text.matchAll(linksRegexp)) {
    internalLinks.push(match[1])
  }
  if (internalLinks.length) {
    result.internalLinks = internalLinks
  }
  return result
}

export { extract, matchPatterns }