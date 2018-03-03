import { isVisible, getOptions } from '../../selectors'
import SparklingFactory from './Sparkling'

export default dependencies => {
	const { React, connect } = dependencies

	const Sparkling = SparklingFactory(dependencies)
	const SparklingContainer = ({ visible, ...props }) => {
		if (!visible) {
			return null
		}

		return <Sparkling {...props} />
	}

	return connect(state => ({
		visible: isVisible(state),
		options: getOptions(state)
	}))(SparklingContainer)
}
