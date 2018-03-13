// @flow

import { isVisible, getOptions } from '../../selectors'
import SparklingFactory from './Sparkling'

import type { Dependencies, State, Options } from '../../types'
import type { ComponentType, StatelessFunctionalComponent } from 'react'
// $FlowFixMe
import type { MapStateToProps } from 'react-redux'

export default (dependencies: Dependencies): ComponentType<{}> => {
	const { React, connect } = dependencies

	const Sparkling = SparklingFactory(dependencies)

	const SparklingContainer: StatelessFunctionalComponent<{
		visible: boolean,
		options: Options
	}> = ({ visible, options }) => {
		if (!visible) {
			return null
		}

		return <Sparkling options={options} />
	}

	const mapStateToProps: MapStateToProps<State, *, *> = (
		state: State
	): { visible: boolean, options: Options } => ({
		visible: isVisible(state),
		options: getOptions(state)
	})

	return connect(mapStateToProps)(SparklingContainer)
}
