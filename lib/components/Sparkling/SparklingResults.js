import { h } from 'preact'
import { connect } from 'preact-redux'

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
	const { preview, renderer, accept } = options

	return (
		<div className="sparkling-results-container">
			<div className="sparkling-results">
				{data.slice(offset, offset + 10).map((item, index) =>
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
