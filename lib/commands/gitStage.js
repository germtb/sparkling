import loadDataFactory from './dataSources/gitFiles'
import commandFactory from './commandFactory'
import renderer from './renderers/gitFile'
import { spawn } from 'child_process'

const gitStageFactory = (h, store) => {
	const loadData = loadDataFactory({ hideDeletedFiles: false })

	const accept = ({ path, status }) => {
		const cwd = atom.project.getPaths()[0]

		let cmdProcess
		const unstaged = [' M', 'MM', '??', ' D', 'AD', 'DD', ' A']

		if (unstaged.includes(status)) {
			cmdProcess = spawn('git', ['add', path], {
				cwd
			})
		} else {
			cmdProcess = spawn('git', ['reset', path], {
				cwd
			})
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
		description: 'Stage and unstage git files'
	}
}

export default commandFactory(gitStageFactory)
