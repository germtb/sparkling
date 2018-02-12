import xs from 'xstream'
import { createStore } from 'redux'

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

const fromActionFactory = store => {
	const oldDispatch = store.dispatch

	const subscriptions = new Set()

	const subscribe = event => {
		subscriptions.add(event)

		return () => {
			subscriptions.delete(event)
		}
	}

	const newDispatch = action => {
		oldDispatch(action)

		for (const subscription of subscriptions) {
			const { actionType, listener } = subscription

			if (actionType === action.type) {
				listener.next(actionType)
			}
		}
	}

	store.dispatch = newDispatch

	return actionType => {
		let unsubscribe

		const producer = {
			start: listener => {
				unsubscribe = subscribe({ actionType, listener })
			},
			stop: () => {
				unsubscribe && unsubscribe()
			}
		}

		return xs.create(producer)
	}
}

function storeFactory(reducers) {
	const store = createStore(reducers)
	const fromAction = fromActionFactory(store)
	const fromSelector = fromSelectorFactory(store)

	return { store, fromSelector, fromAction }
}

module.exports = storeFactory
