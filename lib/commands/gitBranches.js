import { spawn } from 'child_process'

import loadData from './dataSources/gitBranches'

const gitBranchesFactory = (h, store) => {
	const accept = branch => {
		const cwd = atom.project.getPaths()[0]
		const value = branch.value.trim(0)

		if (/^\*/.test(value)) {
			return
		}

		const cmdProcess = spawn('git', ['checkout', value], { cwd })
		cmdProcess.stdout.on('data', () => {
			store.dispatch({
				type: 'HIDE'
			})
		})
	}

	return { loadData, accept }
}

export default gitBranchesFactory
