import React from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'

import { iconClassForPath, wrap, escapeHTML } from '../../utils'
import { getReplace } from '../../selectors'

const replaceRenderer = ({
	item,
	pattern,
	index,
	selectedIndex,
	accept,
	replace
}) => {
	const { start, end, value, path } = item

	const wrappedValue = wrap(
		value,
		pattern,
		start,
		end,
		'replace-downlight',
		`<span class="replace-highlight">${escapeHTML(replace)}</span>`
	)

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
