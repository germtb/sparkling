import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/combineLatest'
import 'rxjs/add/operator/auditTime'
import 'rxjs/add/operator/distinctUntilChanged'
import fuzzaldrinPlus from 'fuzzaldrin-plus'

import store from './store'
import { isVisible, getOptions, getData, getPattern } from './selectors'
const { fromSelector, fromAction } = store

export default () => {
	// let fuzzysortPromise = null
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
				const filteredData = fuzzaldrinPlus.filter(data, pattern, {
					key: 'value'
				})

				store.dispatch({
					type: 'SET_FILTERED_DATA',
					payload: { data: filteredData }
				})
			}
		})

	Observable.combineLatest(fromSelector(isVisible), fromSelector(getOptions))
		.distinctUntilChanged((a, b) => {
			return a[0] === b[0] && a[1] === b[1]
		})
		.subscribe(([visible, options]) => {
			if (!visible) {
				return
			}

			const { loadData } = getOptions(store.getState())

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
