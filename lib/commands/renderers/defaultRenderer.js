import { h } from 'preact'
import fuzzaldrinPlus from 'fuzzaldrin-plus'

const defaultRenderer = ({ item, pattern, index, selectedIndex, accept }) => {
	const value = item.value
	const className =
		index === selectedIndex ? 'sparkling-row selected' : 'sparkling-row'
	const wrappedValue =
		pattern && pattern.length ? fuzzaldrinPlus.wrap(value, pattern) : value
	return (
		<div
			className={className}
			aria-role="button"
			onClick={() => accept(item)}
			dangerouslySetInnerHTML={{ __html: wrappedValue }}
		/>
	)
}

export default defaultRenderer
