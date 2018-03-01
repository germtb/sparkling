import React from 'react'
import classNames from 'classnames'

import { wrap } from '../../utils'

export default ({ item, pattern, className, index, selectedIndex, accept }) => {
	const { value } = item
	const start = 0
	const end = value.indexOf(':')
	const wrappedValue = wrap(
		value.replace(':', ''),
		pattern,
		start,
		end,
		'sparkling-line-number'
	)

	const finalClassName = classNames(
		className,
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
