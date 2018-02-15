import loadData from './dataSources/allFiles'
import renderer from './renderers/file'
import commandFactory from './commandFactory'

const filesFactory = (h, store) => {
	const accept = file => {
		atom.workspace.open(file.value)
		store.dispatch({
			type: 'HIDE'
		})
	}

	return {
		loadData,
		accept,
		renderer
	}
}

export default commandFactory(filesFactory)
