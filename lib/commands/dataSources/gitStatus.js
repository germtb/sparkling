// @flow

import { spawnInProject, gitStatusLabel } from '../../utils'

import type { GitFileItem } from '../../types'

export default ({ hideDeletedFiles }: { hideDeletedFiles: boolean } = {}) => (
	onData: (Array<GitFileItem>) => void
): (() => void) => {
	const cmdProcess = spawnInProject('git', ['status', '-s'])

	cmdProcess.stdout.on('data', data => {
		onData(
			data
				.toString('utf-8')
				.split('\n')
				.filter(value => value.trim() !== '')
				.reduce((acc, value) => {
					const path = value.slice(2).trim()
					const status = value.slice(0, 2)

					if ((hideDeletedFiles && status === 'D') || status === 'DD') {
						return acc
					}

					acc.push({
						value: `${gitStatusLabel(status)}\n${path}`,
						status,
						path
					})
					return acc
				}, [])
		)
	})

	return () => {
		cmdProcess.kill()
	}
}
