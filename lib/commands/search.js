import loadDataFactory from './dataSources/search'
import renderer from './renderers/search'

const searchFactory = (h, store) => {
	const loadData = loadDataFactory(store)

	const accept = line => {
		store.dispatch({ type: 'HIDE' })
		atom.workspace.open(line.path, {
			initialLine: line.lineNumber - 1
		})
	}

	return { loadData, accept, renderer }
}

export default searchFactory
