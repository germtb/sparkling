import { spawnInProject } from '../../utils'
import watchman from 'fb-watchman'

export default onData => {
	const client = new watchman.Client()
	const projectPath = atom.project.getPaths()[0]

	client.command(
		[
			'query',
			projectPath,
			{
				expression: [
					'allof',
					['type', 'f'],
					['exists']
				],
				path: [''],
				fields: ['name']
			}
		],
		(error, response) => {
			onData(response.files.map(value => ({ value })))
		}
	)

	return () => {}
}
