import { spawn } from 'child_process'

export default onData => {
	const cwd = atom.project.getPaths()[0]
	const cmdProcess = spawn('git', ['status', '-s'], { cwd })
	cmdProcess.stdout.on('data', data => {
		onData(
			data
				.toString('utf-8')
				.split('\n')
				.filter(value => value.trim() !== '')
				.map(value => ({ value }))
		)
	})
}
