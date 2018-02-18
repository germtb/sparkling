import { h } from 'preact'
import classNames from 'classnames'
import { connect } from 'preact-redux'

import { iconClassForPath, wrap } from '../../utils'
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

	const start = value.indexOf(RG_RESULT)
	const end = value.indexOf(RG_RESULT) + find.length - 1
	const replacedValue = value.replace(RG_RESULT, find)
	const wrappedValue = wrap(
		replacedValue,
		pattern,
		start,
		end,
		'replace-downlight',
		`<span class="replace-highlight">${replace}</span>`
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
