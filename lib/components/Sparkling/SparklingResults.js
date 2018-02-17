import { h } from 'preact'
import { connect } from 'preact-redux'

import { SLICE_LENGTH } from '../../constants'

import {
	getSparklingData,
	getIndex,
	getOptions,
	getSelectedValue,
	getOffset,
	getPattern
} from '../../selectors'

const SparklingResults = ({
	options,
	selectedValue,
	data,
	selectedIndex,
	offset,
	pattern
}) => {
	const { preview, renderer, accept, columns } = options
	const style = columns
		? {
				'grid-auto-columns': 'minmax(33.3%, 100%)',
				'grid-auto-flow': 'column',
				'grid-template-rows': `repeat(${SLICE_LENGTH / columns}, 1fr)`
			}
		: {
				'grid-auto-flow': 'row'
			}

	return (
		<div className="sparkling-results-container">
			<div className="sparkling-results" style={style}>
				{data.slice(offset, offset + SLICE_LENGTH).map((item, index) =>
					renderer({
						item,
						index,
						selectedIndex,
						accept,
						pattern
					})
				)}
			</div>
			{preview &&
				selectedValue && (
					<div className="sparkling-preview">{preview(selectedValue)}</div>
				)}
		</div>
	)
}

export default connect(state => ({
	options: getOptions(state),
	data: getSparklingData(state),
	selectedIndex: getIndex(state),
	selectedValue: getSelectedValue(state),
	offset: getOffset(state),
	pattern: getPattern(state)
}))(SparklingResults)
