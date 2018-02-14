import { spawn } from 'child_process'

import { getSearch } from '../selectors'

const searchFactory = (h, store) => {
	const loadData = onData => {
		const search = getSearch(store.getState())

		const cwd = atom.project.getPaths()[0]
		const cmdProcess = spawn('rg', [search, '-n'], { cwd })
		cmdProcess.stdout.on('data', data => {
			onData(
				data
					.toString('utf-8')
					.split('\n')
					.reduce((acc, value) => {
						const [path, lineNumber, line] = value.split(':', 3)
						if (line && line.length > 1) {
							acc.push({ value, path, line, lineNumber })
						}
						return acc
					}, [])
			)
		})

		return () => {
			cmdProcess.stdin.pause()
			cmdProcess.kill()
		}
	}

	const accept = line => {
		store.dispatch({ type: 'HIDE' })
		atom.workspace.open(line.path, {
			initialLine: line.lineNumber - 1
		})
	}

	return { loadData, accept }
}

export default searchFactory
