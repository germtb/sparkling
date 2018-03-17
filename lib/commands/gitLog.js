// @flow

import loadData from './dataSources/gitLog'

import type { Dependencies, SimpleItem } from '../types'

export default ({ store }: Dependencies) => {
	const accept = (commit: SimpleItem) => {
		const value = commit.value.split(' ', 1)[0]
		atom.clipboard.write(value)
		store.dispatch({
			type: 'HIDE'
		})
	}

	return {
		loadData,
		accept,
		columns: 1,
		sliceLength: 10,
		description: 'git log - Copy git commit hash to clipboard',
		id: 'sparkling-git-log'
	}
}
