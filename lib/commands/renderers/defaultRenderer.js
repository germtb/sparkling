// @flow

import type { Dependencies, SimpleItem } from '../../types'

import type { StatelessFunctionalComponent } from 'react'

export default ({
	React
}: Dependencies): StatelessFunctionalComponent<{
	item: SimpleItem,
	wrappedValue: string,
	className: string,
	accept: any
}> => ({ item, wrappedValue, className, accept }) => {
	return (
		<div className={className} aria-role="button" onClick={() => accept(item)}>
			{wrappedValue}
		</div>
	)
}
