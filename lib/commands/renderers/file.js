// @flow

import defaultRendererFactory from './defaultRenderer'

import type { Dependencies, SimpleItem } from '../../types'

import type { StatelessFunctionalComponent } from 'react'

export default (
	dependencies: Dependencies
): StatelessFunctionalComponent<{
	item: SimpleItem,
	pattern: string,
	index: number,
	selectedIndex: number,
	accept: any,
	multiselected?: boolean
}> => {
	const { classnames, utils: { iconClassForPath } } = dependencies
	const defaultRenderer = defaultRendererFactory(dependencies)

	return props =>
		defaultRenderer({
			...props,
			className: classnames('icon', ...iconClassForPath(props.item.value))
		})
}
