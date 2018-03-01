import React from 'react'
import { connect } from 'react-redux'

import { isVisible, getOptions } from '../../selectors'
import Sparkling from './Sparkling'

const SparklingContainer = ({ visible, ...props }) => {
	if (!visible) {
		return null
	}

	return <Sparkling {...props} />
}

export default connect(state => ({
	visible: isVisible(state),
	options: getOptions(state)
}))(SparklingContainer)
