import loadData from './dataSources/gitFiles'

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

export default gitFilesFactory
