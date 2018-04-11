// @flow

import nodePath from 'path'
import fs from 'fs'

import { getOptions } from '../../selectors'

import { spawnInProject } from '../../utils'

import type { LsItem, Store } from '../../types'

export default (store: Store) => (
	onData: (Array<LsItem>) => void
): (() => void) => {
	const options = getOptions(store.getState())

	if (options.id !== 'sparkling-ls') {
		return () => {}
	}

	const { path } = options

	const cmdProcess = spawnInProject('ls', ['-a', path])

	cmdProcess.stdout.on('data', data => {
		const { path } = options

		onData(
			data
				.toString('utf-8')
				.split('\n')
				.filter(s => s.length && s !== '.')
				.map(value => {
					const absolutePath = nodePath.resolve(path, value)

					if (value === '.') {
						return { value: '.', absolutePath, isFolder: true }
					} else if (value === '..') {
						return { value: '..', absolutePath, isFolder: true }
					}

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
		cmdProcess.kill()
	}
}
