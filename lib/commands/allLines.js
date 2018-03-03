import loadData from './dataSources/allLines'

export default ({ store }) => {
	const accept = line => {
		store.dispatch({ type: 'HIDE' })
		atom.workspace.open(line.path, {
			initialLine: line.lineNumber - 1
		})
	}

	return {
		loadData,
		accept,
		description: 'Find lines in project',
		id: 'sparkling-project-lines'
	}
}
