export default (root, dependencies) => {
	const { render } = require('react-dom')

	const { React, store, Provider, components } = dependencies

	const { Sparkling, FindContainer, ExtraInputContainer } = components

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
