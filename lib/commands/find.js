import loadDataFactory from './dataSources/find'
import renderer from './renderers/find'
import commandFactory from './commandFactory'

const findFactory = (h, store) => {
	const loadData = loadDataFactory(store)

	const accept = line => {
		atom.workspace.open(line.path, {
			initialLine: line.lineNumber - 1
		})
	}

	return {
		loadData,
		accept,
		renderer,
		description: 'Find pattern in project',
		id: 'sparkling-project-find'
	}
}

export default commandFactory(findFactory)
