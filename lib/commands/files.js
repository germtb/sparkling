import { spawn } from 'child_process'

import FilePreview from '../components/FilePreview'

const filesFactory = (React, store) => {
	const loadData = onData => {
		const cwd = atom.project.getPaths()[0]
		const cmdProcess = spawn('rg', ['--files'], { cwd })
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

	const accept = file => {
		atom.workspace.open(file.value)
		store.dispatch({
			type: 'HIDE'
		})
	}

	const preview = file => {
		return <FilePreview file={file.value} />
	}

	return {
		loadData,
		accept,
		preview
	}
}

module.exports = filesFactory
