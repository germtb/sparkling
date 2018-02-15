import { h } from 'preact'
import fuzzaldrinPlus from 'fuzzaldrin-plus'
import classNames from 'classnames'

const defaultRenderer = ({
	item,
	pattern,
	className,
	index,
	selectedIndex,
	accept
}) => {
	const value = item.value
	const finalClassName = classNames(
		className,
		index === selectedIndex ? 'sparkling-row selected' : 'sparkling-row'
	)
	const wrappedValue =
		pattern && pattern.length ? fuzzaldrinPlus.wrap(value, pattern) : value
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
