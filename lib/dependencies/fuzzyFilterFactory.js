import { escapeHTML } from '../utils'

const wrapFactory = ({ fuzzysort }) => {
	return (str, pattern = '', start, end, className, replace = '') => {
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
}

export default ({ fuzzysort }) => {
	let promise = null

	const wrap = wrapFactory({ fuzzysort })

	const filter = (pattern, data) => {
		promise && promise.cancel()
		promise = fuzzysort.goAsync(pattern, data, { key: 'value' })
		return promise.then(filteredData => filteredData.map(x => x.obj))
	}

	const { single } = fuzzysort

	return { wrap, filter, single }
}
