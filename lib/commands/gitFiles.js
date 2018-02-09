import { spawn } from 'child_process'

import FilePreview from '../components/FilePreview'

const gitFilesFactory = (React, store) => {
	const loadData = onData => {
		const cwd = atom.project.getPaths()[0]
		const cmdProcess = spawn('git', ['status'], { cwd })
		cmdProcess.stdout.on('data', data => {
			onData(
				data
					.toString('utf-8')
					.split('\n')
					.filter(s => /modified/.test(s))
					.filter(s => s.length > 1)
			)
		})
	}

	const accept = file => {
		atom.workspace.open(file)
		store.dispatch({
			type: 'HIDE'
		})
	}

	const preview = file => {
		return <FilePreview file={file} />
	}

	return { loadData, accept, preview }
}

module.exports = gitFilesFactory
