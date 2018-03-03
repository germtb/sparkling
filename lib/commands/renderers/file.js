import defaultRendererFactory from './defaultRenderer'
import { iconClassForPath } from '../../utils'

export default dependencies => {
	const defaultRenderer = defaultRendererFactory(dependencies)

	return props =>
		defaultRenderer({
			...props,
			className: ['icon', ...iconClassForPath(props.item.value)]
		})
}
