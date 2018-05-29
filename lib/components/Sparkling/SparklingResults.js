import { AutoSizer, List } from 'react-virtualized'

import {
	getMultiselected,
	getSparklingData,
	getIndex,
	getOptions,
	getSelectedValue,
	getPattern
} from '../../selectors'

export default ({ React, connect, classnames, wrap }) => {
	const SparklingResults = ({
		options,
		selectedValue,
		data,
		selectedIndex,
		pattern,
		multiselected
	}) => {
		const { preview, renderer, accept, columns, rowHeight } = options

		return (
			<div className="sparkling-results-container" style={{ height: '200px' }}>
				<AutoSizer>
					{({ width, height }) => (
						<List
							width={width}
							height={height}
							rowCount={Math.ceil(data.length / columns)}
							overscanRowCount={10}
							scrollToIndex={Math.floor(selectedIndex / columns)}
							rowHeight={({ index }) =>
								typeof rowHeight === 'function'
									? rowHeight(data[index * columns])
									: rowHeight
							}
							rowRenderer={({ index, key, style }) => {
								const items = data.slice(
									index * columns,
									index * columns + columns
								)

								return (
									<div
										key={key}
										style={{
											display: 'flex',
											...style,
											width: `${100.0 * items.length / columns}%`
										}}
									>
										{items.map((item, subindex) => {
											const itemIndex = index * columns + subindex
											const className = classnames('sparkling-row', {
												['sparkling-row--selected']:
													itemIndex === selectedIndex,
												['sparkling-row--multi-selected']: multiselected.includes(
													item
												)
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
								)
							}}
						/>
					)}
				</AutoSizer>
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
		pattern: getPattern(state),
		multiselected: getMultiselected(state)
	}))(SparklingResults)
}
