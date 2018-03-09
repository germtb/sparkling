// @flow

import type { Dependencies, Item } from '../../types'

import type { StatelessFunctionalComponent } from 'react'

export default ({
	React,
	classnames
}: Dependencies): StatelessFunctionalComponent<{
	item: Item,
	pattern: string,
	index: number,
	selectedIndex: number,
	accept: any
}> => {
	return ({ item, index, selectedIndex }) => {
		const { emoji } = item

		return (
			<div
				className={classnames('sparkling-emoji', {
					'sparkling-emoji-highlight': index === selectedIndex
				})}
			>
				{emoji}
			</div>
		)
	}
}
