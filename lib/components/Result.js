import React from 'react'

const Result = ({ item, index, selectedIndex }) => {
	const { value } = item
	const className =
		index === selectedIndex ? 'sparkling-row selected' : 'sparkling-row'
	return <div className={className}>{value}</div>
}

module.exports = Result
