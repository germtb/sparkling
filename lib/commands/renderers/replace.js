import { h } from 'preact'
import classNames from 'classnames'
import fuzzaldrinPlus from 'fuzzaldrin-plus'

import { iconClassForPath } from '../../utils'
import { RG_RESULT } from '../../constants'

export default ({ item, pattern, index, selectedIndex, accept }) => {
	const { search, replace, value, path } = item

	const fuzzyMatches =
		pattern && pattern.length
			? fuzzaldrinPlus.match(value.replace(RG_RESULT, search), pattern)
			: []

	const styleHash = fuzzyMatches.reduce((acc, x) => {
		acc[x] = 'fuzzy'
		return acc
	}, {})

	styleHash[value.indexOf(RG_RESULT)] = styleHash[value.indexOf(RG_RESULT)]
		? 'searchOpenAndFuzzy'
		: 'searchOpen'
	styleHash[value.indexOf(RG_RESULT) + search.length] = 'searchClose'

	const rawValue = value.replace(new RegExp(RG_RESULT, 'g'), search)
	let wrappedValue = ''

	for (let i = 0; i < rawValue.length; i++) {
		const c = rawValue[i]

		if (styleHash[i] === 'fuzzy') {
			wrappedValue += `<span class="highlight">${c}</span>`
		} else if (styleHash[i] === 'searchOpenAndFuzzy') {
			wrappedValue += `<span class="replace-downlight"><span class="highlight">${c}</span>`
		} else if (styleHash[i] === 'searchOpen') {
			wrappedValue += `<span class="replace-downlight">${c}`
		} else if (styleHash[i] === 'searchClose') {
			wrappedValue += `</span><span class="replace-highlight">${replace}</span>${c}`
		} else {
			wrappedValue += c
		}
	}

	const finalClassName = classNames(
		['icon', ...iconClassForPath(path)],
		index === selectedIndex ? 'sparkling-row selected' : 'sparkling-row'
	)

	return (
		<div
			className={finalClassName}
			aria-role="button"
			onClick={() => accept(item)}
			dangerouslySetInnerHTML={{ __html: wrappedValue }}
		/>
	)
}
