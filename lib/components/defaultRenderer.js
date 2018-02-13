import React from 'react'

const defaultRenderer = ({ value, index, selectedIndex, accept }) => {
	const className =
		index === selectedIndex ? 'sparkling-row selected' : 'sparkling-row'
	return (
		<div className={className} aria-role="button" onClick={() => accept(item)}>
			{value}
		</div>
	)
}

module.exports = defaultRenderer
