import { spawn } from 'child_process'

import loadDataFactory from './dataSources/find'
import renderer from './renderers/replace'
import commandFactory from './commandFactory'

const replaceFactory = (h, store) => {
	const loadData = loadDataFactory(store)

	const accept = item => {
		const { lineNumber, path, find, replace } = item
		const cwd = atom.project.getPaths()[0]

		// sed -i '' -e '11,12s/console.log/supersuper/' lib/commands/replace.js
		const sedRegex = `${lineNumber}/${lineNumber}/${find}/${replace}`
		spawn('sed', ['-i', "''", '-e', sedRegex, path], {
			cwd
		})
		store.dispatch({
			type: 'REMOVE_ITEM',
			payload: { item }
		})
	}

	return {
		loadData,
		accept,
		renderer,
		description: 'Replace pattern in project'
	}
}

export default commandFactory(replaceFactory)
