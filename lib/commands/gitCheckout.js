import loadDataFactory from './dataSources/gitFiles'
import rendererFactory from './renderers/gitFile'
import { spawnInProject } from '../utils'

export default dependencies => {
	const { store } = dependencies

	const renderer = rendererFactory(dependencies)

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
