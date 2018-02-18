import fuzzaldrinPlus from 'fuzzaldrin-plus'
import { spawn } from 'child_process'

let fileIconsService = null

export const setFileIconsService = service => {
	fileIconsService = service
}

export const iconClassForPath = path => {
	return fileIconsService.iconClassForPath(path)
}

export const wrap = (str, pattern, start, end, className, replace = '') => {
	const fuzzyMatches = fuzzaldrinPlus.match(str, pattern)
	const styleHash = fuzzyMatches.reduce((acc, x) => {
		acc[x] = 'fuzzy'
		return acc
	}, {})

	styleHash[start] = styleHash[start] ? 'styledAndFuzzy' : 'styled'
	styleHash[end] = styleHash[end] ? 'closeStyledAndFuzzy' : 'closeStyled'

	let wrappedStr = ''

	for (let i = 0; i < str.length; i++) {
		const c = str[i]

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
