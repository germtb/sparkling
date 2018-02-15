import loadDataFactory from './dataSources/search'
import renderer from './renderers/search'
import commandFactory from './commandFactory'

const replaceFactory = (h, store) => {
	const loadData = loadDataFactory(store)

	const accept = line => {
		atom.workspace.open(line.path, {
			initialLine: line.lineNumber - 1
		})
	}

	return { loadData, accept, renderer }
}

export default commandFactory(replaceFactory)
