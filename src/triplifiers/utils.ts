// Poor man's iterator
function* applyToChunks(text: string, func: any, char = '\n') {
    if (text.indexOf(char) !== -1) {
        let i = 0
        let j = 0
        while ((j = text.indexOf(char, i)) !== -1) {
            const line = text.substring(i, j)
            yield func(line)
            i = j + 1
        }
    } else {
        yield func(text)
    }
}

export {applyToChunks}