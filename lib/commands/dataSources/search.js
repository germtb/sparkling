import { spawn } from 'child_process'

import { RG_RESULT } from '../../constants'
import { getSearch } from '../../selectors'

export default store => onData => {
	const search = getSearch(store.getState())

	const cwd = atom.project.getPaths()[0]
	const cmdProcess = spawn('rg', [search, '-n', '--replace', RG_RESULT], {
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
						acc.push({ value, search, line, path, lineNumber })
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
