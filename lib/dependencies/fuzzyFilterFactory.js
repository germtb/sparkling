// @flow

import type { Element } from 'react'
import type { Wrap, Dependencies, ItemArray, Filter } from '../types'

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
				})}>
				{c}
			</span>
		) : (
			c
		)

	return data.split('').map(wrapCharacter)
}

export default ({ fuzzysort, React, classnames }: Dependencies) => {
	const wrap = wrapFactory({ fuzzysort, React, classnames })

	const filter: Filter = (
		pattern: string,
		data: ItemArray,
		onData: ItemArray => void
	) => {
		let cancel = false

		const SLICE = 100000

		function filterSlice(i) {
			if (cancel) {
				return
			}

			setTimeout(() => {
				const results = fuzzysort.go(
					pattern,
					data.slice(i * SLICE, (i + 1) * SLICE),
					{ key: 'value' }
				)

				onData(results.map(x => x.obj))

				if (i * SLICE < data.length) {
					filterSlice(i + 1)
				}
			}, 0)
		}

		filterSlice(0)

		return () => {
			cancel = true
		}
	}

	return { wrap, filter }
}
