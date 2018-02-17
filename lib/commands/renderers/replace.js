import { h } from 'preact'
import classNames from 'classnames'
import { connect } from 'preact-redux'
import fuzzaldrinPlus from 'fuzzaldrin-plus'

import { iconClassForPath } from '../../utils'
import { RG_RESULT } from '../../constants'
import { getReplace } from '../../selectors'

const replaceRenderer = ({
	item,
	pattern,
	index,
	selectedIndex,
	accept,
	replace
}) => {
	const { find, value, path } = item

	const rawValue = value.replace(RG_RESULT, find)

	const fuzzyMatches =
		pattern && pattern.length ? fuzzaldrinPlus.match(rawValue, pattern) : []

	const styleHash = fuzzyMatches.reduce((acc, x) => {
		acc[x] = 'fuzzy'
		return acc
	}, {})

	styleHash[value.indexOf(RG_RESULT)] = styleHash[value.indexOf(RG_RESULT)]
		? 'findOpenAndFuzzy'
		: 'findOpen'
	styleHash[value.indexOf(RG_RESULT) + find.length - 1] = styleHash[
		value.indexOf(RG_RESULT) + find.length - 1
	]
		? 'findCloseAndFuzzy'
		: 'findClose'

	let wrappedValue = ''

	for (let i = 0; i < rawValue.length; i++) {
		const c = rawValue[i]

		if (styleHash[i] === 'fuzzy') {
			wrappedValue += `<span class="highlight">${c}</span>`
		} else if (styleHash[i] === 'findOpenAndFuzzy') {
			wrappedValue += `<span class="replace-downlight"><span class="highlight">${c}</span>`
		} else if (styleHash[i] === 'findOpen') {
			wrappedValue += `<span class="replace-downlight">${c}`
		} else if (styleHash[i] === 'findClose') {
			wrappedValue += `${c}</span><span class="replace-highlight">${replace}</span>`
		} else if (styleHash[i] === 'findCloseAndFuzzy') {
			wrappedValue += `<span class="highlight">${c}</span></span><span class="replace-highlight">${replace}</span>`
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

const Replace = connect(state => ({
	replace: getReplace(state)
}))(replaceRenderer)

export default props => <Replace {...props} />
