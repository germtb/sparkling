import { createStore } from 'redux'
import { Observable } from 'rxjs/Observable'

import reducers from './reducers'

const fromSelectorFactory = store => selector =>
	Observable.create(observer => {
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
		Observable.create(observer => {
			subscribe({ actionType, observer })
		})
}

function storeFactory(reducers) {
	const store = createStore(reducers)
	const fromAction = fromActionFactory(store)
	const fromSelector = fromSelectorFactory(store)
	store.fromSelector = fromSelector
	store.fromAction = fromAction

	return store
}

export default storeFactory(reducers)
