export default ({ React, classnames }) => {
	return ({ item, className }) => (
		<div className={classnames('sparkling-emoji', className)}>{item.emoji}</div>
	)
}
