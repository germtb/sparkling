import { spawnInProject } from '../../utils'

export default onData => {
	const cmdProcess = spawnInProject('rg', [
		'^.*$',
		'-n',
		'--max-filesize',
		'100K'
	])
	cmdProcess.stdout.on('data', data => {
		onData(
			data
				.toString('utf-8')
				.split('\n')
				.reduce((acc, value) => {
					const [path, lineNumber, ...splitLine] = value.split(':')
					const line = splitLine.join(':')

					if (line && line.length > 1) {
						acc.push({
							value: [path, lineNumber, splitLine].join(' : '),
							path,
							line,
							lineNumber
						})
					}
					return acc
				}, [])
		)
	})

	return () => {
		cmdProcess.stdout.pause()
		cmdProcess.kill()
	}
}
