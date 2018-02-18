import { h } from 'preact'
import classNames from 'classnames'

import { iconClassForPath, wrap } from '../../utils'
import { RG_RESULT } from '../../constants'

export default ({ item, pattern, index, selectedIndex, accept }) => {
	const { find, value, path } = item

	const start = value.indexOf(RG_RESULT)
	const end = value.indexOf(RG_RESULT) + find.length - 1
	const foundValue = value.replace(RG_RESULT, find)
	const wrappedValue = wrap(foundValue, pattern, start, end, 'find-highlight')

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
