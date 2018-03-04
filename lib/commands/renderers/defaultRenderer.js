export default ({ React, classnames, wrap }) => ({
	item,
	pattern,
	className,
	index,
	selectedIndex,
	accept
}) => {
	const { value } = item

	const finalClassName = classnames(
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
