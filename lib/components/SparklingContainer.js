import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import {
	isVisible,
	getSparklingData,
	getIndex,
	getOptions,
	getSelectedValue,
	getRawDataLength,
	getOffset,
	getPattern
} from '../selectors'
import Sparkling from './Sparkling'

class SparklingContainer extends Component {
	render() {
		if (!this.props.visible) {
			return null
		}

		if (!this.props.data) {
			return <div>Loading...</div>
		}

		return <Sparkling {...this.props} />
	}
}

export default connect(
	state => ({
		visible: isVisible(state),
		data: getSparklingData(state),
		selectedIndex: getIndex(state),
		options: getOptions(state),
		selectedValue: getSelectedValue(state),
		rawDataLength: getRawDataLength(state),
		offset: getOffset(state),
		pattern: getPattern(state)
	}),
	dispatch => ({
		setPattern: pattern =>
			dispatch({ type: 'SET_PATTERN', payload: { pattern } })
	})
)(SparklingContainer)
