import loadDataFactory from './dataSources/gitFiles'
import commandFactory from './commandFactory'
import renderer from './renderers/gitFile'
import { spawnInProject } from '../utils'

const gitStageFactory = (React, store) => {
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

export default commandFactory(gitStageFactory)
