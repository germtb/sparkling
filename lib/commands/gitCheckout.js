

import loadDataFactory from './dataSources/gitStatus'
import rendererFactory from './renderers/gitFile'
import { spawnInProject } from '../utils'

                                                         

export default (dependencies              ) => {
	const { store } = dependencies

	const renderer = rendererFactory(dependencies)

	const loadData = loadDataFactory()

	const accept = (item             ) => {
		const cmdProcess = spawnInProject('git', ['checkout', '--', item.path])

		cmdProcess.on('exit', () => {
			store.dispatch({
				type: 'REMOVE_ITEM',
				payload: { item }
			})
		})
	}

	return {
		loadData,
		accept,
		renderer,
		columns: 3,
		description: 'git checkout -- files',
		id: 'sparkling-git-checkout'
	}
}
