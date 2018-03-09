// @flow

import type { Dependencies, Item } from '../../types'

import type { StatelessFunctionalComponent } from 'react'

export default ({
	React,
	classnames,
	wrap,
	utils: { iconClassForPath }
}: Dependencies): StatelessFunctionalComponent<{
	item: Item,
	pattern: string,
	index: number,
	selectedIndex: number,
	accept: any
}> => ({ item, pattern, index, selectedIndex, accept }) => {
	const { start, end, value, path } = item

	const wrappedValue = wrap(value, pattern, start, end, 'find-highlight')

	const finalClassName = classnames(
		'sparkling-row',
		['icon', ...iconClassForPath(path)],
		{
			['sparkling-row--selected']: index === selectedIndex
		}
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
