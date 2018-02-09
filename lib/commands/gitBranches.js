import { spawn } from 'child_process'

const gitBranchesFactory = (React, store) => {
	const loadData = onData => {
		const cwd = atom.project.getPaths()[0]
		const cmdProcess = spawn('git', ['branch'], { cwd })
		cmdProcess.stdout.on('data', data => {
			onData(
				data
					.toString('utf-8')
					.split('\n')
					.filter(s => s.length > 1)
			)
		})
	}

	const accept = value => {
		const cwd = atom.project.getPaths()[0]
		value = value.trim(0)

		if (/^\*/.test(value)) {
			console.log(`Already on ${value.substring(2)}`)
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

module.exports = gitBranchesFactory
