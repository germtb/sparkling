import { Transform } from 'stream'

export default ({ startLine, startColumn, endLine, endColumn, replace }) => {
	let linesLength = 0

	return new Transform({
		transform(chunk, encoding, callback) {
			const splitChunk = chunk.toString('utf-8').split('\n')

			const lines = splitChunk.reduce((lines, line, index) => {
				const lineIndex = index + linesLength

				if (lineIndex === startLine && lineIndex === endLine) {
					lines.push([
						line.slice(0, startColumn) + replace + line.slice(endColumn)
					])
				} else if (lineIndex === startLine) {
					lines.push([line.slice(0, startColumn)])
				} else if (lineIndex > startLine && lineIndex < endLine) {
					// Ignore
				} else if (lineIndex === endLine) {
					lines[lines.length - 1] += replace + line.slice(endColumn)
				} else {
					lines.push(line)
				}

				return lines
			}, [])

			linesLength += lines.length

			callback(null, lines.join('\n'))
		}
	})
}
