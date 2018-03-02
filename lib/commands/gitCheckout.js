import loadDataFactory from './dataSources/gitFiles'
import renderer from './renderers/gitFile'
import { spawnInProject } from '../utils'

export default (React, store) => {
	const loadData = loadDataFactory()

	const accept = ({ path }) => {
		const cmdProcess = spawnInProject('git', ['checkout', '--', path])

		cmdProcess.on('exit', () => {
			store.dispatch({
				type: 'RELOAD'
			})
		})
	}

	return {
		loadData,
		accept,
		renderer,
		columns: 3,
		description: 'git checkout -- files',
		id: 'sparkling-git-checkout'
	}
}
