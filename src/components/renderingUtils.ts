function splitTextLink(txt: string, links: Array<string>) {
    const includesLink = (txt: string) => {
        const match = links.filter((x) => (txt === `[[${x}]]` || txt.indexOf(`[[${x}]]`) > 0))
        return match.length > 0 ? match[0] : false
    }
    const match = includesLink(txt)
    if (match) {
        const pre = txt.substring(0, txt.indexOf(`[[${match}]]`))
        const result = []
        if (pre.length) {
            result.push({
                value: pre,
                type: 'text'
            })
        }
        result.push({
            value: match,
            type: 'link',
        })
        return result
    }
    return null
}

function getSpans(text: string, links: Array<string>) {

    let result: any = []
    let current = 0
    for (let i = 0; i < text.length; i++) {
        let chunk = text.substring(current, i)
        const matches = splitTextLink(chunk, links)
        if (matches) {
            current = i
            result = [...result, ...matches]
        }
        if (i === text.length - 1) { // Add the last chunk
            const tail = text.substring(current, text.length)
            const matches = splitTextLink(tail, links)
            if (matches) {
                result = [...result, ...matches]
            } else {
                result.push({
                    value: tail,
                    type: 'text'
                })
            }
        }
    }
    return result
}

export {getSpans}