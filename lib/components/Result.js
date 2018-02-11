import React from 'react'

const Result = ({ item, index, selectedIndex, accept }) => {
	const { value } = item
	const className =
		index === selectedIndex ? 'sparkling-row selected' : 'sparkling-row'
	return (
		<div className={className} aria-role="button" onClick={() => accept(item)}>
			{value}
		</div>
	)
}

module.exports = Result
