import { spawn } from 'child_process'

export default onData => {
	const cwd = atom.project.getPaths()[0]
	const cmdProcess = spawn('rg', ['^.*$', '-n', '--max-filesize', '500K'], {
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
						acc.push({ value, path, line, lineNumber })
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
