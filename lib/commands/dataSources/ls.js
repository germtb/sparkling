import { spawn } from 'child_process'
import nodePath from 'path'
import fs from 'fs'

import { getOptions } from '../../selectors'

export default store => onData => {
	const options = getOptions(store.getState())
	const { path } = options

	const cwd = atom.project.getPaths()[0]
	const cmdProcess = spawn('ls', ['-a', path], {
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

					const isFolder = fs.lstatSync(absolutePath).isDirectory()
					return { value: projectRelativePath, absolutePath, isFolder }
				})
				.sort((a, b) => {
					if (a.isFolder && !b.isFolder) {
						return -1
					} else if (!a.isFolder && b.isFolder) {
						return 1
					} else if (a.absolutePath > b.absolutePath) {
						return 1
					} else if (b.absolutePath < a.absolutePath) {
						return -1
					}

					return 0
				})
		)
	})

	return () => {
		cmdProcess.stdin.pause()
		cmdProcess.kill()
	}
}
