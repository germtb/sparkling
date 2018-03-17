// @flow

import defaultRendererFactory from './defaultRenderer'

import type { Dependencies } from '../../types'

import type { StatelessFunctionalComponent } from 'react'

export default (
	dependencies: Dependencies
): StatelessFunctionalComponent<*> => {
	const { classnames, utils: { iconClassForPath } } = dependencies
	const defaultRenderer = defaultRendererFactory(dependencies)

	return props =>
		defaultRenderer({
			...props,
			className: classnames(
				props.className,
				'icon',
				...iconClassForPath(props.item.value)
			)
		})
}
