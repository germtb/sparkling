import { getOptions, getData, getPattern } from '../selectors'

export default ({ store, fromSelector, fromAction, Observable, filter }) => {
	let cancelLoadData = null
	let cancelFilterData = null

	Observable.combineLatest(
		fromSelector(getData),
		fromSelector(getPattern)
	).subscribe(([data, pattern]) => {
		if (cancelFilterData && typeof cancelFilterData === 'function') {
			cancelFilterData()
			cancelFilterData = null
		}

		if (!pattern.length && !data) {
			return
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
		if (cancelLoadData && typeof cancelLoadData === 'function') {
			cancelLoadData()
			cancelLoadData = null
		}

		const options = getOptions(store.getState())

		const { loadData } = options

		let first = true

		cancelLoadData = loadData(data => {
			store.dispatch({
				type: 'APPEND_DATA',
				payload: {
					data,
					set: first
				}
			})

			first = false
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
