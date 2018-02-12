import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import {
	isVisible,
	getSparklingData,
	getIndex,
	getOptions,
	getSelectedValue,
	getRawDataLength,
	getOffset
} from '../selectors'
import Sparkling from './Sparkling'

class SparklingContainer extends PureComponent {
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

module.exports = connect(
	state => ({
		visible: isVisible(state),
		data: getSparklingData(state),
		selectedIndex: getIndex(state),
		options: getOptions(state),
		selectedValue: getSelectedValue(state),
		rawDataLength: getRawDataLength(state),
		offset: getOffset(state)
	}),
	dispatch => ({
		setPattern: pattern =>
			dispatch({ type: 'SET_PATTERN', payload: { pattern } })
	})
)(SparklingContainer)
