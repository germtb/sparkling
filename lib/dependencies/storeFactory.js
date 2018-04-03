// @flow

import reducersObject from '../reducers'

import type {
	Action,
	Thunk,
	Selector,
	ActionType,
	Store,
	CombineReducers
} from '../types'

import typeof { Observable } from 'rxjs/Observable'
import typeof { createStore } from 'redux'

const fromSelectorFactory = ({
	store,
	Observable
}: {
	store: Store,
	Observable: Observable
}) => <T>(selector: Selector<T>): Observable<T> =>
	Observable.create(observer => {
		return store.subscribe(() => {
			const state = store.getState()
			const selectedState = selector(state)
			observer.next(selectedState)
		})
	}).distinctUntilChanged()

const fromActionFactory = ({
	store,
	Observable
}: {
	store: Store,
	Observable: Observable
}) => {
	const oldDispatch = store.dispatch

	const subscriptions = new Set()

	const subscribe = event => {
		subscriptions.add(event)

		return () => {
			subscriptions.delete(event)
		}
	}

	const newDispatch = (action: Action | Thunk) => {
		console.log('action: ', action)
		if (typeof action === 'function') {
			action(newDispatch, store.getState)
		} else {
			oldDispatch(action)

			for (const subscription of subscriptions) {
				const { actionType, observer } = subscription

				if (actionType === action.type) {
					observer.next()
				}
			}
		}
	}

	store.dispatch = newDispatch

	return (actionType: ActionType): Observable<void> =>
		Observable.create(observer => {
			return subscribe({ actionType, observer })
		})
}

export default function storeFactory({
	Observable,
	createStore,
	combineReducers
}: {
	Observable: Observable,
	createStore: createStore,
	combineReducers: CombineReducers
}) {
	const reducers = combineReducers(reducersObject)
	const store: Store = createStore(reducers)
	const fromAction = fromActionFactory({ store, Observable })
	const fromSelector = fromSelectorFactory({ store, Observable })
	store.subscribe(() => {
		console.log(store.getState())
	})

	return { store, fromAction, fromSelector }
}
