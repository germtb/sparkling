import { spawn } from 'child_process'

export default ({ hideDeletedFiles }) => onData => {
	const cwd = atom.project.getPaths()[0]
	const cmdProcess = spawn('git', ['status', '-s'], { cwd })
	cmdProcess.stdout.on('data', data => {
		onData(
			data
				.toString('utf-8')
				.split('\n')
				.filter(value => value.trim() !== '')
				.reduce((acc, value) => {
					const path = value.slice(2).trim()
					const status = value.slice(0, 2).trim()

					if ((hideDeletedFiles && status === 'D') || status === 'DD') {
						return acc
					}

					acc.push({ value: path, status, path })
					return acc
				}, [])
		)
	})
}
