import loadDataFactory from './dataSources/gitStatus'
import rendererFactory from './renderers/gitFile'
import { spawnInProject } from '../utils'

export default dependencies => {
	const { store } = dependencies

	const renderer = rendererFactory(dependencies)

	const loadData = loadDataFactory({ dependencies, hideDeletedFiles: false })

	const accept = ({ path, status }) => {
		let cmdProcess
		const unstaged = [' M', 'MM', '??', ' D', 'AD', 'DD', ' A']

		if (unstaged.includes(status)) {
			cmdProcess = spawnInProject('git', ['add', path])
		} else {
			cmdProcess = spawnInProject('git', ['reset', path])
		}

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
		description: 'Stage and unstage git files',
		id: 'sparkling-git-stage'
	}
}
