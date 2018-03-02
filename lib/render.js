import React from 'react'
import { Provider } from 'react-redux'

import Sparkling from './components/Sparkling'
import FindContainer from './components/FindContainer'
import ExtraInputContainer from './components/ExtraInputContainer'

export default (root, dependencies) => {
	const { render } = require('react-dom')

	const { store } = dependencies

	render(
		<Provider store={store}>
			<div>
				<Sparkling />
				<FindContainer />
				<ExtraInputContainer />
			</div>
		</Provider>,
		root
	)
}
