import ReactDOM from 'react-dom'
import React, { PureComponent } from 'react'
import { Provider } from 'react-redux'
import path from 'path'
import fs from 'fs'
import sampleCombine from 'xstream/extra/sampleCombine'
import dropRepeats from 'xstream/extra/dropRepeats'
import debounce from 'xstream/extra/debounce'
import throttle from 'xstream/extra/throttle'
import { CompositeDisposable } from 'atom'
import fuzzysort from 'fuzzysort'
import xs from 'xstream'

import SparklingContainer from './components/SparklingContainer'

import gitBranchesFactory from './commands/gitBranches'
import filesFactory from './commands/files'
import gitFilesFactory from './commands/gitFiles'
import linesFactory from './commands/lines'
import allLinesFactory from './commands/allLines'
import storeFactory from './store'
import Result from './components/Result'

import reducers from './reducers'
import {
	isVisible,
	getOptions,
	getData,
	getIndex,
	getOffset,
	getSparklingData,
	getSelectedValue,
	getPattern
} from './selectors'

const { fromSelector, fromAction, store } = storeFactory(reducers)
let fuzzysortPromise = null

xs
	.combine(
		fromSelector(getData).compose(dropRepeats()),
		fromSelector(getPattern).compose(dropRepeats())
	)
	.subscribe({
		next: ([data, pattern]) => {
			if (pattern.length < 3) {
				store.dispatch({
					type: 'SET_FILTERED_DATA',
					payload: { data }
				})
			} else {
				if (fuzzysortPromise) {
					fuzzysortPromise.cancel()
				}

				fuzzysortPromise = fuzzysort.goAsync(pattern, data, {
					key: 'value',
					threshold: -10000
				})
				fuzzysortPromise.then(results => {
					const filteredData = results.reduce((acc, result) => {
						acc.push(result.obj)
						return acc
					}, [])

					store.dispatch({
						type: 'SET_FILTERED_DATA',
						payload: { data: filteredData }
					})
				})

				// new Promise(resolve => {
				// 	const filteredData = fz.filter(data, pattern, { key: 'value' })
				// 	store.dispatch({
				// 		type: 'SET_FILTERED_DATA',
				// 		payload: { data: filteredData }
				// 	})
				// })
			}
		}
	})

fromSelector(isVisible)
	.compose(dropRepeats())
	.compose(sampleCombine(fromSelector(getOptions)))
	.filter(([visible, { loadData }]) => visible)
	.subscribe({
		next: ([visible, { loadData }]) => {
			loadData(data => {
				store.dispatch({
					type: 'APPEND_DATA',
					payload: {
						data
					}
				})
			})
		}
	})

fromAction('HIDE').subscribe({
	next: () => {
		const editor = atom.workspace.getActiveTextEditor()
		const view = editor && atom.views.getView(editor)
		view && view.focus()
	}
})

const next = () => {
	const state = store.getState()
	const index = getIndex(state)
	const sparklingData = getSparklingData(state)

	if (index === 9) {
		const offset = getOffset(state)
		const value = Math.min(offset + 1, sparklingData.length - 10)
		store.dispatch({ type: 'SET_OFFSET', payload: { value } })
	} else {
		const value = Math.min(index + 1, sparklingData.length - 1, 9)
		store.dispatch({ type: 'SET_INDEX', payload: { value } })
	}
}

const previous = () => {
	const state = store.getState()
	const index = getIndex(state)

	if (index === 0) {
		const offset = getOffset(state)
		const value = Math.max(offset - 1, 0)
		store.dispatch({ type: 'SET_OFFSET', payload: { value } })
	} else {
		const value = Math.max(index - 1, 0)
		store.dispatch({ type: 'SET_INDEX', payload: { value: value } })
	}
}

const hide = () => {
	store.dispatch({ type: 'HIDE' })
}

const accept = () => {
	const state = store.getState()
	const value = getSelectedValue(state)

	if (value === null || value === undefined) {
		return
	}

	const { accept } = getOptions(state)
	accept(value)
}

const sparklingSearch = optionsFactory => {
	const {
		loadData,
		accept,
		renderer = props => <Result {...props} />,
		preview = null
	} = optionsFactory(React, store)

	return () => {
		if (isVisible(store.getState())) {
			const sparklingEditor = document.getElementById('sparkling-editor')

			if (sparklingEditor.hasFocus()) {
				store.dispatch({
					type: 'HIDE'
				})
			} else {
				sparklingEditor.focus()
			}
		} else {
			store.dispatch({
				type: 'SHOW',
				payload: {
					loadData,
					accept,
					renderer,
					preview
				}
			})
		}
	}
}

module.exports = {
	subscriptions: null,

	provideSparkling() {
		return sparklingSearch
	},

	activate() {
		const reactRoot = document.createElement('div')

		ReactDOM.render(
			<Provider store={store}>
				<SparklingContainer />
			</Provider>,
			reactRoot
		)

		atom.workspace.addBottomPanel({ item: reactRoot, model: {} })

		const gitFiles = sparklingSearch(gitFilesFactory)
		const files = sparklingSearch(filesFactory)
		const gitBranches = sparklingSearch(gitBranchesFactory)
		const lines = sparklingSearch(linesFactory)
		const allLines = sparklingSearch(allLinesFactory)

		this.subscriptions = new CompositeDisposable()
		this.subscriptions.add(
			atom.commands.add('atom-workspace', {
				'sparkling:next': next,
				'sparkling:previous': previous,
				'sparkling:accept': accept,
				'sparkling:gitBranches': gitBranches,
				'sparkling:files': files,
				'sparkling:gitFiles': gitFiles,
				'sparkling:lines': lines,
				'sparkling:allLines': allLines,
				'sparkling:hide': hide
			})
		)
	},

	deactivate() {
		this.disposables = []
		this.subscriptions.dispose()

		this.renameView && this.renameView.destroy()
		this.renameView = null
	},

	serialize() {
		return {}
	}
}
