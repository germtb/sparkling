export default ({ React, classnames }) => {
	return ({ item, index, selectedIndex }) => {
		const { emoji } = item

		return (
			<div
				className={classnames('sparkling-emoji', {
					'sparkling-emoji-highlight': index === selectedIndex
				})}
			>
				{emoji}
			</div>
		)
	}
}
