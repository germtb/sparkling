import classNames from 'classnames'

import { iconClassForPath } from '../../utils'

export default ({ React, wrap }) => ({
	item,
	pattern,
	index,
	selectedIndex,
	accept
}) => {
	const { start, end, value, path } = item

	const wrappedValue = wrap(value, pattern, start, end, 'find-highlight')

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
