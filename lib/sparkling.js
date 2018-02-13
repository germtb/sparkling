import ReactDOM from 'react-dom'
import React, { PureComponent } from 'react'
import { Provider } from 'react-redux'
import path from 'path'
import fs from 'fs'
import Rx from 'rxjs'
import { CompositeDisposable } from 'atom'
import fuzzaldrinPlus from 'fuzzaldrin-plus'
import cluster from 'cluster'

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
let cancelLoadData = null

Rx.Observable.combineLatest(fromSelector(getData), fromSelector(getPattern))
	.auditTime(100)
	.subscribe(([data, pattern]) => {
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

Rx.Observable.combineLatest(fromSelector(isVisible), fromSelector(getOptions))
	.filter(([visible]) => visible)
	.distinctUntilChanged((a, b) => {
		return a[0] === b[0] && a[1] === b[1]
	})
	.subscribe(([visible, options]) => {
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
	const editor = atom.workspace.getActiveTextEditor()
	const view = editor && atom.views.getView(editor)
	view && view.focus()

	if (fuzzysortPromise) {
		fuzzysortPromise.cancel()
	}

	if (cancelLoadData && typeof cancelLoadData === 'function') {
		cancelLoadData()
		cancelLoadData = null
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
