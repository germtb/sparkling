import defaultRenderer from './defaultRenderer'
import { iconClassForPath } from '../../utils'

export default props => {
	const { absolutePath } = props.item

	return defaultRenderer({
		...props,
		className: ['icon', ...iconClassForPath(absolutePath)]
	})
}
