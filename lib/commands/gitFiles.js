import { spawn } from 'child_process'

import FilePreview from '../components/FilePreview'

const gitFilesFactory = (React, store) => {
	const loadData = onData => {
		const repo = atom.project.getRepositories()[0]

		const cwd = atom.project.getPaths()[0]
		const cmdProcess = spawn('git', ['status', '-s'], { cwd })
		cmdProcess.stdout.on('data', data => {
			onData(
				data
					.toString('utf-8')
					.split('\n')
					.filter(value => value.trim() !== '')
					.map(value => ({ value }))
			)
		})
	}

	const accept = file => {
		const filePath = file.value.slice(2).trim()
		atom.workspace.open(filePath)
		store.dispatch({
			type: 'HIDE'
		})
	}

	const preview = file => {
		const filePath = file.value.slice(2).trim()
		return <FilePreview file={filePath} />
	}

	return { loadData, accept, preview }
}

module.exports = gitFilesFactory