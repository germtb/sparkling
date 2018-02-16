import { spawn } from 'child_process'

import loadDataFactory from './dataSources/search'
import renderer from './renderers/replace'
import commandFactory from './commandFactory'

const replaceFactory = (h, store) => {
	const loadData = loadDataFactory(store)

	const accept = item => {
		console.log('item: ', item)
		const cwd = atom.project.getPaths()[0]
		const cmdProcess = spawn('ls', ['-a', path], {
			cwd
		})

		// atom.workspace.open(line.path, {
		// 	initialLine: line.lineNumber - 1
		// })
	}

	return { loadData, accept, renderer }
}

export default commandFactory(replaceFactory)
