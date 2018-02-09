const defaultRendererFactory = (React, store) => ({
	value,
	index,
	selectedIndex
}) => {
	const className =
		index === selectedIndex ? 'sparkling-row selected' : 'sparkling-row'
	return <div className={className}>{value}</div>
}

module.exports = defaultRendererFactory
