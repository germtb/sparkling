import { spawn } from 'child_process'
import nodePath from 'path'

import { getOptions } from '../../selectors'

export default store => onData => {
	const options = getOptions(store.getState())
	const { path } = options

	const cwd = atom.project.getPaths()[0]
	const cmdProcess = spawn('ls', [path], {
		cwd
	})

	cmdProcess.stdout.on('data', data => {
		const options = getOptions(store.getState())
		const { path } = options

		onData(
			data
				.toString('utf-8')
				.split('\n')
				.filter(s => s.length > 1)
				.map(value => {
					const absolutePath = nodePath.resolve(path, value)
					const cwd = atom.project.getPaths()[0]
					const projectRelativePath =
						cwd === absolutePath ? cwd : absolutePath.replace(cwd, '~')

					return { value: projectRelativePath, absolutePath }
				})
				.reverse()
		)
	})

	return () => {
		cmdProcess.stdin.pause()
		cmdProcess.kill()
	}
}
