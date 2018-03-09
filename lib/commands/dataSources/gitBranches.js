// @flow

import { spawnInProject } from '../../utils'

import type { Item } from '../../types'

export default (onData: (Array<Item>) => void): (() => void) => {
	const cmdProcess = spawnInProject('git', ['branch'])
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
		cmdProcess.stdin.pause()
		cmdProcess.kill()
	}
}
