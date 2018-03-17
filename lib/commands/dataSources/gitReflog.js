// @flow

import { spawnInProject } from '../../utils'

import type { SimpleItem } from '../../types'

export default (onData: (Array<SimpleItem>) => void): (() => void) => {
	const cmdProcess = spawnInProject('git', ['reflog'])
	cmdProcess.stdout.on('data', data => {
		onData(
			data
				.toString('utf-8')
				.split('\n')
				.filter(s => s.length > 1)
				.map(value => ({ value }))
		)
	})

	return () => {
		// cmdProcess.stdin.pause()
		cmdProcess.kill()
	}
}
