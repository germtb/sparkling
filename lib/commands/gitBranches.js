import child_process from 'child_process'

const gitBranchesFactory = (h, store) => {
	const loadData = onData => {
		const cwd = atom.project.getPaths()[0]
		const cmdProcess = child_process.spawn('git', ['branch'], { cwd })
		cmdProcess.stdout.on('data', data => {
			onData(
				data
					.toString('utf-8')
					.split('\n')
					.filter(s => s.length > 1)
					.map(value => ({ value }))
			)
		})
	}

	const accept = branch => {
		const cwd = atom.project.getPaths()[0]
		const value = branch.value.trim(0)

		if (/^\*/.test(value)) {
			return
		}

		const cmdProcess = child_process.spawn('git', ['checkout', value], { cwd })
		cmdProcess.stdout.on('data', () => {
			store.dispatch({
				type: 'HIDE'
			})
		})
	}

	return { loadData, accept }
}

export default gitBranchesFactory
