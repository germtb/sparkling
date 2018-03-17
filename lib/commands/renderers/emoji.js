// @flow

import type { Dependencies, EmojiItem } from '../../types'

import type { StatelessFunctionalComponent } from 'react'

export default ({
	React,
	classnames
}: Dependencies): StatelessFunctionalComponent<{
	item: EmojiItem,
	pattern: string,
	index: number,
	selectedIndex: number,
	accept: any,
	multiselected?: boolean
}> => {
	return ({ item, index, selectedIndex, multiselected }) => {
		const { emoji } = item

		return (
			<div
				className={classnames('sparkling-emoji', {
					['sparkling-emoji-highlight']: index === selectedIndex,
					['sparkling-row--multi-selected']: multiselected
				})}
			>
				{emoji}
			</div>
		)
	}
}
