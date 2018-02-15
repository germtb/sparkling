import defaultRenderer from './defaultRenderer'
import { iconClassForPath } from '../../utils'

export default props =>
	defaultRenderer({
		...props,
		className: ['icon', ...iconClassForPath(props.item.value)]
	})
