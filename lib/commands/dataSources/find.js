import { spawn } from 'child_process'

import { RG_RESULT } from '../../constants'
import { getFind } from '../../selectors'

export default store => onData => {
	const find = getFind(store.getState())

	const cwd = atom.project.getPaths()[0]
	const cmdProcess = spawn(
		'rg',
		[find, '-n', '--replace', RG_RESULT, '--max-filesize', '100K'],
		{
			cwd
		}
	)
	cmdProcess.stdout.on('data', data => {
		onData(
			data
				.toString('utf-8')
				.split('\n')
				.reduce((acc, value) => {
					const [path, lineNumber, line] = value.split(':', 3)
					if (line && line.length > 1) {
						line.split(RG_RESULT).forEach((_, index, splitLine) => {
							if (index === splitLine.length - 1) {
								return
							}

							const line = splitLine.reduce((s, substr, i) => {
								if (i === index) {
									return s + substr + RG_RESULT
								} else if (i < splitLine.length - 1) {
									return s + substr + find
								}

								return s + substr
							}, '')

							acc.push({
								value: value
									.split(':', 2)
									.concat([line])
									.join(' : '),
								find,
								line,
								path,
								lineNumber
							})
						})
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
