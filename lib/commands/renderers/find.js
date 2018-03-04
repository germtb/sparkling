import { iconClassForPath } from '../../utils'

export default ({ React, classnames, wrap }) => ({
	item,
	pattern,
	index,
	selectedIndex,
	accept
}) => {
	const { start, end, value, path } = item

	const wrappedValue = wrap(value, pattern, start, end, 'find-highlight')

	const finalClassName = classnames(
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
