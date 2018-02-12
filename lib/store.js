import Rx from 'rxjs'
import { createStore } from 'redux'

const fromSelectorFactory = store => selector =>
	Rx.Observable.create(observer => {
		store.subscribe(() => {
			const state = store.getState()
			const selectedState = selector(state)
			observer.next(selectedState)
		})
	}).distinctUntilChanged()

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
		console.log('action: ', action)
		oldDispatch(action)

		for (const subscription of subscriptions) {
			const { actionType, observer } = subscription

			if (actionType === action.type) {
				observer.next(actionType)
			}
		}
	}

	store.dispatch = newDispatch

	return actionType =>
		Rx.Observable.create(observer => {
			subscribe({ actionType, observer })
		})
}

function storeFactory(reducers) {
	const store = createStore(reducers)
	const fromAction = fromActionFactory(store)
	const fromSelector = fromSelectorFactory(store)

	store.subscribe(() => {
		console.log(store.getState())
	})

	return { store, fromSelector, fromAction }
}

module.exports = storeFactory
