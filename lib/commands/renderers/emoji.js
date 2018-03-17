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
	multiselected?: boolean,
	className: string
}> => {
	return ({ item, className }) => (
		<div className={classnames('sparkling-emoji', className)}>{item.emoji}</div>
	)
}
