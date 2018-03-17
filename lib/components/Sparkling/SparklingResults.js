import {
	getMultiselected,
	getSparklingData,
	getIndex,
	getOptions,
	getSelectedValue,
	getOffset,
	getPattern
} from '../../selectors'

export default ({ React, connect, classnames, wrap }) => {
	const SparklingResults = ({
		options,
		selectedValue,
		data,
		selectedIndex,
		offset,
		pattern,
		multiselected
	}) => {
		const { preview, renderer, accept, columns, sliceLength } = options
		const style =
			columns > 1
				? {
						'grid-auto-columns': `minmax(${100.0 / columns}%, 100%)`,
						'grid-auto-flow': 'column',
						'grid-template-rows': `repeat(${sliceLength / columns}, 1fr)`
				  }
				: {
						'grid-auto-flow': 'row'
				  }

		return (
			<div className="sparkling-results-container">
				<div className="sparkling-results" style={style}>
					{data.slice(offset, offset + sliceLength).map((item, index) => {
						const className = classnames('sparkling-row', {
							['sparkling-row--selected']: index === selectedIndex,
							['sparkling-row--multi-selected']: multiselected.includes(item)
						})

						const wrappedValue = wrap(item.value, pattern)

						return renderer({
							item,
							accept,
							wrappedValue,
							className
						})
					})}
				</div>
				{preview &&
					selectedValue && (
						<div className="sparkling-preview">{preview(selectedValue)}</div>
					)}
			</div>
		)
	}

	return connect(state => ({
		options: getOptions(state),
		data: getSparklingData(state),
		selectedIndex: getIndex(state),
		selectedValue: getSelectedValue(state),
		offset: getOffset(state),
		pattern: getPattern(state),
		multiselected: getMultiselected(state)
	}))(SparklingResults)
}
