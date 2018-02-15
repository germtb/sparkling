import loadData from './dataSources/allLines'
import commandFactory from './commandFactory'

export const allLinesFactory = (h, store) => {
	const accept = line => {
		store.dispatch({ type: 'HIDE' })
		atom.workspace.open(line.path, {
			initialLine: line.lineNumber - 1
		})
	}

	return { loadData, accept }
}

export default commandFactory(allLinesFactory)
