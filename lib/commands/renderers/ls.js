import defaultRendererFactory from './defaultRenderer'
import { iconClassForPath } from '../../utils'

export default dependencies => {
	const defaultRenderer = defaultRendererFactory(dependencies)
	return props => {
		const { absolutePath } = props.item

		return defaultRenderer({
			...props,
			className: ['icon', ...iconClassForPath(absolutePath)]
		})
	}
}
