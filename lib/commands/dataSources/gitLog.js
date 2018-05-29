

import { spawnInProject } from '../../utils'

                                             

export default (onData                             )               => {
	const cmdProcess = spawnInProject('git', [
		'log',
		'--pretty=oneline',
		'--abbrev-commit'
	])
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
		cmdProcess.kill()
	}
}
