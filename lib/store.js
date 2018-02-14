import { createStore } from 'redux'
import { Observable } from 'rxjs/Observable'

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
		Observable.create(observer => {
			subscribe({ actionType, observer })
		})
}

function storeFactory(reducers) {
	const store = createStore(reducers)
	store.subscribe(() => {
		console.log(store.getState())
	})
	const fromAction = fromActionFactory(store)
	const fromSelector = fromSelectorFactory(store)

	return { store, fromSelector, fromAction }
}

export default storeFactory
