import React from 'react'
import { Provider } from 'react-redux'

import Sparkling from './components/Sparkling'
import FindContainer from './components/FindContainer'
import ExtraInputContainer from './components/ExtraInputContainer'

import store from './store'
import setupObservables from './observables'

export default () => {
	const { render } = require('react-dom')
	const reactRoot = document.createElement('div')

	render(
		<Provider store={store}>
			<div>
				<Sparkling />
				<FindContainer />
				<ExtraInputContainer />
			</div>
		</Provider>,
		reactRoot
	)

	setupObservables()

	atom.workspace.addBottomPanel({ item: reactRoot, model: {} })
}
