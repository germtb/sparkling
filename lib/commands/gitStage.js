import loadDataFactory from './dataSources/gitFiles'
import commandFactory from './commandFactory'
import renderer from './renderers/gitFile'
import { spawnInProject } from '../utils'

const gitStageFactory = (React, store) => {
	const loadData = loadDataFactory({ hideDeletedFiles: false })

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

export default commandFactory(gitStageFactory)
