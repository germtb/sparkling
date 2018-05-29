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
				})}
			>
				{c}
			</span>
		) : (
			c
		)

	return data.split('').map(wrapCharacter)
}

const runIterator = (iterator, onResult, onFinish, ms = 16) => {
	let canceled = false
	let current = null

	const cancel = () => {
		canceled = true
	}

	const run = () =>
		new Promise(resolve => {
			const start = performance.now()
			let current = iterator.next()

			while (!current.done) {
				onResult && onResult(current.value)
				current = iterator.next()

				if (performance.now() - start > ms) {
					resolve()
					return
				}
			}
		}).then(() => {
			if (current && current.done) {
				onFinish && onFinish()
				return
			}

			if (canceled) {
				return
			}

			setTimeout(() => run(), 0)
		})

	setTimeout(() => run(), 0)
	return cancel
}

// const runWorker = async (iterator, onResult) => {
// 	let current = iterator.next()
// 	const sw = await filterServiceWorker
//
// 	while (!current.done) {
// 		const channel = new MessageChannel()
// 		channel.port1.onmessage = e => {
// 			console.log(e)
// 		}
//
// 		onResult && onResult(current.value)
// 		sw.postMessage({ method: () => iterator.next() }, [channel.port2])
//
// 		current = iterator.next()
// 	}
//
// 	return () => null
// }

export default ({ fuzzysort, React, classnames }) => {
	const wrap = wrapFactory({ fuzzysort, React, classnames })
	const SLICE = 10000

	function* filterGenerator(pattern, data) {
		for (let i = 0; i < data.length; i += SLICE) {
			yield fuzzysort
				.go(pattern, data.slice(i * SLICE, (i + 1) * SLICE), { key: 'value' })
				.map(x => x.obj)
		}
	}

	const filter = (pattern, data, onData) => {
		return runIterator(filterGenerator(pattern, data), onData)
	}

	return { wrap, filter }
}
