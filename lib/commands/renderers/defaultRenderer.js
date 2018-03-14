// @flow

import type { Dependencies, Item } from '../../types'

import type { StatelessFunctionalComponent } from 'react'

export default ({
	React,
	classnames,
	wrap
}: Dependencies): StatelessFunctionalComponent<{
	item: Item,
	pattern: string,
	className: string,
	index: number,
	selectedIndex: number,
	accept: any,
	multiselected?: boolean
}> => ({
	item,
	pattern,
	className,
	index,
	selectedIndex,
	accept,
	multiselected
}) => {
	const { value } = item

	const finalClassName = classnames(className, 'sparkling-row', {
		['sparkling-row--selected']: index === selectedIndex,
		['sparkling-row--multi-selected']: multiselected
	})

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
