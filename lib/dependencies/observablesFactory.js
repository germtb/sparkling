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
	let cancelFilterData = null

	Observable.combineLatest(fromSelector(getData), fromSelector(getPattern))
		// .auditTime(100)
		.subscribe(([data, pattern]) => {
			if (!pattern.length && (!data || !data.length)) {
				return
			}

			if (cancelFilterData && typeof cancelFilterData === 'function') {
				cancelFilterData()
			}

			if (!pattern.length) {
				store.dispatch({
					type: 'APPEND_FILTERED_DATA',
					payload: { data, set: true }
				})
			} else {
				let first = true

				cancelFilterData = filter(pattern, data, filteredData => {
					store.dispatch({
						type: 'APPEND_FILTERED_DATA',
						payload: { data: filteredData, set: first }
					})

					first = false
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

		if (cancelFilterData && typeof cancelFilterData === 'function') {
			cancelFilterData()
			cancelFilterData = null
		}
	})
}
