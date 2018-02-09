import xs from 'xstream'

const fromSelectorFactory = store => selector => {
	let unsubscribe

	const producer = {
		start: listener => {
			unsubscribe = store.subscribe(() => {
				const state = store.getState()
				const selectedState = selector(state)
				listener.next(selectedState)
			})
		},
		stop: () => {
			unsubscribe && unsubscribe()
		}
	}

	return xs.create(producer)
}

module.exports = { fromSelectorFactory }
