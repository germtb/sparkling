import { fuzzyFilter } from './utils'

import { getOptions, getData, getPattern, getSelectedValue } from './selectors'

export default (store, Observable) => {
	const { fromSelector, fromAction } = store

	let cancelLoadData = null

	fromSelector(getSelectedValue)
		.debounceTime(100)
		.subscribe(selectedValue => {
			const options = getOptions(store.getState())
			const { onValue } = options
			onValue && onValue(selectedValue)
		})

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
				fuzzyFilter(pattern, data).then(filteredData => {
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
