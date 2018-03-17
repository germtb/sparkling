import defaultRendererFactory from './defaultRenderer'

export default dependencies => {
	const { utils: { iconClassForPath }, classnames } = dependencies
	const defaultRenderer = defaultRendererFactory(dependencies)
	return props => {
		const { className } = props
		const { absolutePath } = props.item

		return defaultRenderer({
			...props,
			className: classnames(
				className,
				'icon',
				...iconClassForPath(absolutePath)
			)
		})
	}
}
