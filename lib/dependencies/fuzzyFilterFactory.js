// @flow

import type { Element } from 'react'
import type { Wrap, Dependencies } from '../types'

const wrapFactory = ({ classnames, fuzzysort, React }): Wrap => (
	data,
	pattern
) => {
	const match = fuzzysort.single(pattern, data)
	const indexes = match ? match.indexes : []
	const wrapCharacter = (c: string, index: number): string | Element<string> =>
		indexes.includes(index) || c === '\t' || c === ' ' ? (
			<span
				className={classnames({
					['highlight']: indexes.includes(index),
					['sparkling-tab']: c === '\t',
					['sparkling-space']: c === ' '
				})}
			>
				{c}
			</span>
		) : (
			c
		)

	return data.split('').map(wrapCharacter)
}

export default ({ fuzzysort, React, classnames }: Dependencies) => {
	let promise = null

	const wrap = wrapFactory({ fuzzysort, React, classnames })

	const filter = (pattern, data) => {
		promise && promise.cancel()
		promise = fuzzysort.goAsync(pattern, data, { key: 'value' })
		return promise.then(filteredData => filteredData.map(x => x.obj))
	}

	return { wrap, filter }
}
