// @flow

import defaultRendererFactory from './defaultRenderer'

import type { Dependencies, Item } from '../../types'

import type { StatelessFunctionalComponent } from 'react'

export default (
	dependencies: Dependencies
): StatelessFunctionalComponent<{
	item: Item,
	pattern: string,
	index: number,
	selectedIndex: number,
	accept: any
}> => {
	const { classnames, utils: { iconClassForPath } } = dependencies
	const defaultRenderer = defaultRendererFactory(dependencies)

	return props =>
		defaultRenderer({
			...props,
			className: classnames('icon', ...iconClassForPath(props.item.value))
		})
}
