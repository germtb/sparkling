import { spawn } from 'child_process'
import fs from 'fs'

const lsFactory = (React, store) => {
	const loadData = onData => {
		const cwd = atom.project.getPaths()[0]
		const cmdProcess = spawn('ls', [], { cwd })
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

	const accept = path => {
		const cwd = atom.project.getPaths()[0]
		const fileName = path.resolve(cwd, path)
		console.log('fileName: ', fileName)
		console.log('path: ', path)
		// atom.workspace.open(path.value)
		// store.dispatch({
		// 	type: 'HIDE'
		// })
	}

	return {
		loadData,
		accept
	}
}

module.exports = lsFactory
