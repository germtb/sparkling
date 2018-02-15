import loadData from './dataSources/allFiles'

const filesFactory = (h, store) => {
	const accept = file => {
		atom.workspace.open(file.value)
		store.dispatch({
			type: 'HIDE'
		})
	}

	return {
		loadData,
		accept
	}
}

export default filesFactory
