import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/combineLatest'
import 'rxjs/add/observable/merge'
import 'rxjs/add/operator/auditTime'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/distinctUntilChanged'

import { fuzzyFilter } from './utils'

import store from './store'
import { getOptions, getData, getPattern, getSelectedValue } from './selectors'
const { fromSelector, fromAction } = store

export default () => {
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

	fromAction('HIDE_SEARCH').subscribe(() => {
		const editor = atom.workspace.getActiveTextEditor()
		const view = editor && atom.views.getView(editor)
		view && view.focus()
	})

	fromAction('HIDE_REPLACE').subscribe(() => {
		const editor = atom.workspace.getActiveTextEditor()
		const view = editor && atom.views.getView(editor)
		view && view.focus()
	})

	fromAction('HIDE').subscribe(() => {
		const editor = atom.workspace.getActiveTextEditor()
		const view = editor && atom.views.getView(editor)
		view && view.focus()

		// if (fuzzysortPromise) {
		// 	fuzzysortPromise.cancel()
		// }

		if (cancelLoadData && typeof cancelLoadData === 'function') {
			cancelLoadData()
			cancelLoadData = null
		}
	})
}
