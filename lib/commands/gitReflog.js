// @flow

import loadData from './dataSources/gitReflog'

import type { Dependencies, Item } from '../types'

export default ({ store }: Dependencies) => {
	const accept = (commit: Item) => {
		const value = commit.value.split(' ', 1)[0]
		atom.clipboard.write(value)
		store.dispatch({
			type: 'HIDE'
		})
	}

	return {
		loadData,
		accept,
		description: 'git reflog - Copy git commit hash to clipboard',
		id: 'sparkling-git-reflog'
	}
}
