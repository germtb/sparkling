import { spawn } from 'child_process'

const allLinesFactory = (React, store) => {
	const loadData = onData => {
		const cwd = atom.project.getPaths()[0]
		const cmdProcess = spawn('rg', ['^.*$', '-n', '--max-filesize', '500K'], {
			cwd
		})
		cmdProcess.stdout.on('data', data => {
			onData(
				data
					.toString('utf-8')
					.split('\n')
					.reduce((acc, value) => {
						const [path, lineNumber, line] = value.split(':', 3)
						if (line && line.length > 1 && line.length < 100) {
							acc.push({ value, path, line, lineNumber })
						}
						return acc
					}, [])
			)
		})
	}

	const accept = line => {
		store.dispatch({ type: 'HIDE' })
		atom.workspace.open(line.path, {
			initialLine: line.lineNumber - 1
		})
	}

	return { loadData, accept }
}

module.exports = allLinesFactory
