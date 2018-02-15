import loadData from './dataSources/gitFiles'
import commandFactory from './commandFactory'

const gitFilesFactory = (h, store) => {
	const accept = file => {
		const filePath = file.value.slice(2).trim()
		atom.workspace.open(filePath)
		store.dispatch({
			type: 'HIDE'
		})
	}

	return { loadData, accept }
}

export default commandFactory(gitFilesFactory)
