import { isVisible, getOptions } from '../../selectors'
import SparklingFactory from './Sparkling'

export default dependencies => {
	const { React, connect } = dependencies

	const Sparkling = SparklingFactory(dependencies)
	const SparklingContainer = ({ visible, options }) => {
		if (!visible) {
			return null
		}

		return <Sparkling options={options} />
	}

	return connect(state => ({
		visible: isVisible(state),
		options: getOptions(state)
	}))(SparklingContainer)
}
