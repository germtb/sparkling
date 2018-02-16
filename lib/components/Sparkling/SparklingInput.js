import { h } from 'preact'
import classNames from 'classnames'
import { connect } from 'preact-redux'

import {
	getPattern,
	getSparklingData,
	getOptions,
	getRawDataLength
} from '../../selectors'
import Input from '../Input'

const SparklingInput = ({
	options,
	data,
	rawDataLength,
	pattern,
	setPattern
}) => {
	const { description, childrenRenderer } = options
	const filteredDataLength = data.length

	return (
		<div className="sparkling-input-container">
			<div className="sparkling-meta-data">
				<span>{`${filteredDataLength} / ${rawDataLength}`}</span>
				<span className="sparkling-command-description">{description}</span>
			</div>

			<Input
				autoFocus
				id="sparkling-input"
				tabIndex={1}
				className={classNames('sparkling-input', 'native-key-bindings', {
					'sparkling-input--has-results': filteredDataLength > 0,
					'sparkling-input--no-results':
						filteredDataLength === 0 && rawDataLength > 0
				})}
				placeholder="Sparkling fuzzy filter"
				value={pattern}
				setValue={setPattern}
			/>

			{childrenRenderer && childrenRenderer()}
		</div>
	)
}

export default connect(
	state => ({
		data: getSparklingData(state),
		options: getOptions(state),
		rawDataLength: getRawDataLength(state),
		pattern: getPattern(state)
	}),
	dispatch => ({
		setPattern: pattern =>
			dispatch({ type: 'SET_PATTERN', payload: { pattern } })
	})
)(SparklingInput)