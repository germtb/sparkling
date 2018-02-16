import { h } from 'preact'
import classNames from 'classnames'
import fuzzaldrinPlus from 'fuzzaldrin-plus'

import { iconClassForPath } from '../../utils'
import { RG_RESULT } from '../../constants'

export default ({ item, pattern, index, selectedIndex, accept }) => {
	const { find, value, path } = item

	const fuzzyMatches =
		pattern && pattern.length
			? fuzzaldrinPlus.match(value.replace(RG_RESULT, find), pattern)
			: []

	const styleHash = fuzzyMatches.reduce((acc, x) => {
		acc[x] = 'fuzzy'
		return acc
	}, {})

	styleHash[value.indexOf(RG_RESULT)] = styleHash[value.indexOf(RG_RESULT)]
		? 'findOpenAndFuzzy'
		: 'findOpen'
	styleHash[value.indexOf(RG_RESULT) + find.length - 1] = 'findClose'

	const rawValue = value.replace(new RegExp(RG_RESULT, 'g'), find)
	let wrappedValue = ''

	for (let i = 0; i < rawValue.length; i++) {
		const c = rawValue[i]

		if (styleHash[i] === 'fuzzy') {
			wrappedValue += `<span class="highlight">${c}</span>`
		} else if (styleHash[i] === 'findOpenAndFuzzy') {
			wrappedValue += `<span class="find-highlight"><span class="highlight">${c}</span>`
		} else if (styleHash[i] === 'findOpen') {
			wrappedValue += `<span class="find-highlight">${c}`
		} else if (styleHash[i] === 'findClose') {
			wrappedValue += `${c}</span>`
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
