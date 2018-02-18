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
					const [path, lineNumber, line] = value.split(':', 3)

					if (line && line.length > 1) {
						acc.push({
							value: value.split(':', 3).join(' : '),
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
