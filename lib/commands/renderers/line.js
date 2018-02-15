import defaultRenderer from './defaultRenderer'

export default ({ item, ...props }) =>
	defaultRenderer({
		...props,
		item: {
			...item,
			value: item.line
		}
	})
