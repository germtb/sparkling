export default (root, dependencies) => {
	const { render } = require('react-dom')

	const { React, store, Provider, components } = dependencies

	const { Sparkling, ExtraInputContainer } = components

	render(
		<Provider store={store}>
			<div>
				<Sparkling />
				<ExtraInputContainer />
			</div>
		</Provider>,
		root
	)
}
