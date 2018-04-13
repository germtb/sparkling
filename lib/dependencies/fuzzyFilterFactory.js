const wrapFactory = ({ classnames, fuzzysort, React }) => (data, pattern) => {
	const match = fuzzysort.single(pattern, data)
	const indexes = match ? match.indexes : []
	const wrapCharacter = (c, index) =>
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

export default ({ fuzzysort, React, classnames }) => {
	const wrap = wrapFactory({ fuzzysort, React, classnames })

	const filter = (pattern, data, onData) => {
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
