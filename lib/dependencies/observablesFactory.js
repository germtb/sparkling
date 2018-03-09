// @flow

import { getOptions, getData, getPattern } from '../selectors'

import type { Store, FromAction, Filter } from '../types'

import typeof { Observable as ObservableClass } from 'rxjs/Observable'

export default ({
	store,
	fromSelector,
	fromAction,
	Observable,
	filter
}: {
	store: Store,
	fromSelector: any,
	fromAction: FromAction,
	Observable: ObservableClass,
	filter: Filter
}) => {
	let cancelLoadData = null

	Observable.combineLatest(fromSelector(getData), fromSelector(getPattern))
		.auditTime(100)
		.subscribe(([data, pattern]) => {
			if (!pattern.length && (!data || !data.length)) {
				return
			}

			if (!pattern.length) {
				store.dispatch({
					type: 'SET_FILTERED_DATA',
					payload: { data }
				})
			} else {
				filter(pattern, data).then(filteredData => {
					store.dispatch({
						type: 'SET_FILTERED_DATA',
						payload: { data: filteredData }
					})
				})
			}
		})

	Observable.merge(fromAction('RELOAD'), fromAction('SHOW')).subscribe(() => {
		const options = getOptions(store.getState())

		const { loadData } = options

		if (cancelLoadData && typeof cancelLoadData === 'function') {
			cancelLoadData()
		}

		cancelLoadData = loadData(data => {
			store.dispatch({
				type: 'APPEND_DATA',
				payload: {
					data
				}
			})
		})
	})

	fromAction('HIDE').subscribe(() => {
		if (cancelLoadData && typeof cancelLoadData === 'function') {
			cancelLoadData()
			cancelLoadData = null
		}
	})
}
