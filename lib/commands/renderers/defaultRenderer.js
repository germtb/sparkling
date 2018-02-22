import { h } from 'preact'
import classNames from 'classnames'

import { wrap } from '../../utils'

const defaultRenderer = ({
	item,
	pattern,
	className,
	index,
	selectedIndex,
	accept
}) => {
	const { value } = item

	const finalClassName = classNames(
		className,
		index === selectedIndex ? 'sparkling-row selected' : 'sparkling-row'
	)

	const wrappedValue = wrap(value, pattern)

	return (
		<div
			className={finalClassName}
			aria-role="button"
			onClick={() => accept(item)}
			dangerouslySetInnerHTML={{ __html: wrappedValue }}
		/>
	)
}

export default defaultRenderer
