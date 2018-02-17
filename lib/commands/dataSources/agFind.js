import { spawn } from 'child_process'

import { getFind } from '../../selectors'

export default store => onData => {
	const find = getFind(store.getState())

	const cwd = atom.project.getPaths()[0]
	const cmdProcess = spawn('ag', [find, '--no-break', '--no-group'], {
		cwd
	})
	cmdProcess.stdout.on('data', data => {
		onData(
			data
				.toString('utf-8')
				.split('\n')
				.reduce((acc, value) => {
					console.log('value: ', value)
					const [path, lineNumber, line] = value.split(':', 3)
					console.log('line: ', line)
					console.log('lineNumber: ', lineNumber)
					console.log('path: ', path)
					console.log('--------------')
					acc.push({
						value: value
							.split(':', 2)
							.concat([line])
							.join(''),
						find,
						line,
						path,
						lineNumber
					})

					return acc
				}, [])
		)
	})

	return () => {
		cmdProcess.stdin.pause()
		cmdProcess.kill()
	}
}
