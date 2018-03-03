export default (root, dependencies) => {
	const { render } = require('react-dom')

	const {
		React,
		store,
		Provider,
		Sparkling,
		FindContainer,
		ExtraInputContainer
	} = dependencies

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
