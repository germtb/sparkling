import ReactDOM from 'react-dom'
import React, { PureComponent } from 'react'
import { Provider } from 'react-redux'
import path from 'path'
import fs from 'fs'
import sampleCombine from 'xstream/extra/sampleCombine'
import dropRepeats from 'xstream/extra/dropRepeats'
import { CompositeDisposable } from 'atom'
import { createStore } from 'redux'
import { spawn } from 'child_process'

import SparklingContainer from './components/SparklingContainer'

import gitBranchesFactory from './commands/gitBranches'
import filesFactory from './commands/files'
import gitFilesFactory from './commands/gitFiles'
import linesFactory from './commands/lines'
import { fromSelectorFactory, fromActionFactory } from './utils'
import Result from './components/Result'

import reducers from './reducers'
import {
	isVisible,
	getOptions,
	getData,
	getIndex,
	getSparklingData,
	getSelectedValue
} from './selectors'

const store = createStore(reducers)

store.subscribe(() => {
	console.log(JSON.stringify(store.getState(), null, 2))
})

const fromAction = fromActionFactory(store)
const fromSelector = fromSelectorFactory(store)

fromSelector(isVisible)
	.compose(dropRepeats())
	.compose(sampleCombine(fromSelector(getOptions)))
	.filter(([visible, { loadData }]) => visible)
	.subscribe({
		next: ([visible, { loadData }]) => {
			loadData(data => {
				store.dispatch({
					type: 'SET_DATA',
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
		const view = atom.views.getView(editor)
		view.focus()
	}
})

const next = () => {
	const state = store.getState()
	const index = getIndex(state)
	const sparklingData = getSparklingData(state)
	const value = Math.min(index + 1, sparklingData.length - 1)

	store.dispatch({ type: 'SET_INDEX', payload: { value } })
}

const previous = () => {
	const state = store.getState()
	const index = getIndex(state)
	const sparklingData = getSparklingData(state)
	const value = Math.max(index - 1, 0)

	store.dispatch({ type: 'SET_INDEX', payload: { value } })
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
