import loadStackOverflow from './dataSources/stackOverflow'

export default dependencies => {
	const { store } = dependencies

	const loadData = loadStackOverflow(store)

	const accept = item => {
		console.log('item: ', item)
		// store.dispatch({ type: 'HIDE' })
	}

	return {
		loadData,
		accept,
		sliceLength: 10,
		columns: 1,
		description: 'Emoji insertion',
		id: 'sparkling-emoji'
	}
}
