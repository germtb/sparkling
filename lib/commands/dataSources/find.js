import { spawn } from 'child_process'

import { RG_RESULT } from '../../constants'
import { getFind, getReplace } from '../../selectors'

export default store => onData => {
	const find = getFind(store.getState())
	const replace = getReplace(store.getState())

	const cwd = atom.project.getPaths()[0]
	const cmdProcess = spawn('rg', [find, '-n', '--replace', RG_RESULT], {
		cwd
	})
	cmdProcess.stdout.on('data', data => {
		onData(
			data
				.toString('utf-8')
				.split('\n')
				.reduce((acc, value) => {
					const [path, lineNumber, line] = value.split(':', 3)
					if (line && line.length > 1) {
						acc.push({ value, find, line, path, lineNumber, replace })
					}
					return acc
				}, [])
		)
	})

	return () => {
		cmdProcess.stdin.pause()
		cmdProcess.kill()
	}
}
