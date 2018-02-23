import fuzzysort from 'fuzzysort'
import { spawn } from 'child_process'

let fileIconsService = null
let promise = null

export const fuzzyFilter = (pattern, data) => {
	promise && promise.cancel()
	promise = fuzzysort.goAsync(pattern, data, { key: 'value' })
	return promise.then(filteredData => filteredData.map(x => x.obj))
}

export const setFileIconsService = service => {
	fileIconsService = service
}

export const iconClassForPath = path => {
	return fileIconsService.iconClassForPath(path)
}

export const escapeHTML = str =>
	str.replace(/[\u00A0-\u9999<>\&]/gim, i => '&#' + i.charCodeAt(0) + ';')

export const wrap = (
	str,
	pattern = '',
	start,
	end,
	className,
	replace = ''
) => {
	const match = fuzzysort.single(pattern, str)
	const indexes = match && match.indexes ? match.indexes : []
	const styleHash = indexes.reduce((acc, x) => {
		acc[x] = 'fuzzy'
		return acc
	}, {})

	styleHash[start] = styleHash[start] ? 'styledAndFuzzy' : 'styled'
	styleHash[end] = styleHash[end] ? 'closeStyledAndFuzzy' : 'closeStyled'

	let wrappedStr = ''
	for (let i = 0; i < str.length; i++) {
		const c = escapeHTML(str[i])

		if (styleHash[i] === 'fuzzy') {
			wrappedStr += `<span class="highlight">${c}</span>`
		} else if (styleHash[i] === 'styledAndFuzzy') {
			wrappedStr += `<span class="${className}"><span class="highlight">${c}</span>`
		} else if (styleHash[i] === 'styled') {
			wrappedStr += `<span class="${className}">${c}`
		} else if (styleHash[i] === 'closeStyled') {
			wrappedStr += `${c}</span>${replace}`
		} else if (styleHash[i] === 'closeStyledAndFuzzy') {
			wrappedStr += `<span class="highlight">${c}</span></span>${replace}`
		} else {
			wrappedStr += c
		}
	}

	return wrappedStr
}

export const spawnInProject = (cmd, args) => {
	const cwd = atom.project.getPaths()[0]
	return spawn(cmd, args, {
		cwd
	})
}

const ackmateDFA = {
	initial: (line, state) =>
		line[0] === ':'
			? { type: 'inFile', state: { ...state, fileName: line.slice(1) } }
			: { type: 'error', state },
	inFile: (line, state) => {
		const [lineNumberStr, ...splitRestDataLine] = line.split(';')
		const restDataLine = splitRestDataLine.join(';')

		const [matches, ...splitLine] = restDataLine.split(':')
		const fileLine = splitLine.join(':')
		const startLine = parseInt(lineNumberStr)
		const endLine = startLine
		const splitMatches = matches.split(',')

		for (const match of splitMatches) {
			const [startStr, lengthStr] = match.split(' ')
			const startColumn = parseInt(startStr)
			const endColumn = parseInt(lengthStr) + startColumn

			state.processedData.push({
				value: fileLine,
				match: fileLine.slice(startColumn, endColumn),
				path: state.fileName,
				startLine,
				startColumn,
				endLine,
				endColumn
			})
		}

		return { type: 'inFile', state }
	},
	inMatch: (line, state) => ({ type: 'error', state }),
	error: (line, state) => ({ type: 'error', state })
}

export const ackmateParser = lines => {
	let node = {
		type: 'initial',
		state: {
			processedData: []
		}
	}

	for (const line of lines) {
		// console.log(JSON.stringify(node, null, 2))
		node = ackmateDFA[node.type](line, node.state)
	}

	// console.log(JSON.stringify(node, null, 2))
	return node.state.processedData
}
