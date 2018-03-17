// @flow

import type { Dependencies, SimpleItem } from '../../types'

import type { StatelessFunctionalComponent } from 'react'

export default ({
	React,
	wrap
}: Dependencies): StatelessFunctionalComponent<{
	item: SimpleItem,
	pattern: string,
	className: string,
	accept: any
}> => ({ item, pattern, className, accept }) => {
	const { value } = item
	const wrappedValue = wrap(value, pattern)

	return (
		<div className={className} aria-role="button" onClick={() => accept(item)}>
			{wrappedValue}
		</div>
	)
}
