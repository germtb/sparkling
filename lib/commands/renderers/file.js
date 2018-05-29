import defaultRendererFactory from './defaultRenderer'

export default dependencies => {
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
