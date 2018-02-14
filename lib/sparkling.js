import { h, render } from 'preact'
import { Provider } from 'preact-redux'

import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/combineLatest'
import 'rxjs/add/operator/auditTime'
import 'rxjs/add/operator/distinctUntilChanged'

import { CompositeDisposable } from 'atom'
import fuzzaldrinPlus from 'fuzzaldrin-plus'

import SparklingContainer from './components/SparklingContainer'
import SearchContainer from './components/SearchContainer'

import gitBranchesFactory from './commands/gitBranches'
import filesFactory from './commands/files'
import gitFilesFactory from './commands/gitFiles'
import linesFactory from './commands/lines'
import searchFactory from './commands/search'
import { allLinesFactory, autocompleteLinesFactory } from './commands/allLines'

import storeFactory from './store'
import defaultRenderer from './components/defaultRenderer'

import config from './config'

import reducers from './reducers'
import {
	isVisible,
	getOptions,
	getData,
	getIndex,
	getOffset,
	getSparklingData,
	getSelectedValue,
	getPattern,
	isSearchVisible
} from './selectors'

const { fromSelector, fromAction, store } = storeFactory(reducers)
let fuzzysortPromise = null
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
		renderer = defaultRenderer,
		preview = null
	} = optionsFactory(h, store)

	const options = {
		loadData,
		accept,
		renderer,
		preview
	}

	return () => {
		const state = store.getState()
		if (isVisible(state)) {
			const storeOptions = getOptions(state)
			const sparklingInput = document.getElementById('sparkling-input')

			if (storeOptions === options) {
				if (sparklingInput === document.activeElement) {
					hide()
				} else {
					sparklingInput.focus()
				}
			} else {
				store.dispatch({
					type: 'SHOW',
					payload: options
				})
				sparklingInput.focus()
			}
		} else {
			store.dispatch({
				type: 'SHOW',
				payload: options
			})
		}
	}
}

const searchToggle = () => {
	if (isSearchVisible(store.getState())) {
		store.dispatch({ type: 'HIDE_SEARCH' })
	} else {
		store.dispatch({ type: 'SHOW_SEARCH' })
	}
}

module.exports = {
	subscriptions: null,

	config,

	commands: [
		{ id: 'files', factory: filesFactory },
		{ id: 'gitFiles', factory: gitFilesFactory },
		{ id: 'gitBranches', factory: gitBranchesFactory },
		{ id: 'lines', factory: linesFactory },
		{ id: 'allLines', factory: allLinesFactory },
		{ id: 'autocompleteLines', factory: autocompleteLinesFactory }
	],

	provideSparkling() {
		return sparklingSearch
	},

	setup() {
		const reactRoot = document.createElement('div')

		render(
			<Provider store={store}>
				<div>
					<SparklingContainer />
					<SearchContainer />
				</div>
			</Provider>,
			reactRoot
		)

		atom.workspace.addBottomPanel({ item: reactRoot, model: {} })

		this.subscriptions.add(
			atom.commands.add('atom-workspace', {
				'sparkling:next': next,
				'sparkling:previous': previous,
				'sparkling:accept': accept,
				'sparkling:hide': hide
			})
		)

		const workspaceView = atom.views.getView(atom.workspace)

		const searchCommand = sparklingSearch(searchFactory)

		atom.commands.add('atom-workspace', {
			'sparkling:acceptSearch': searchCommand
		})

		atom.commands.add('atom-workspace', {
			'sparkling:search': searchToggle
		})

		this.commands.forEach(commandConfig => {
			atom.config.observe(`sparkling.${commandConfig.id}`, value => {
				if (value) {
					const command = sparklingSearch(commandConfig.factory)
					commandConfig.subscription = atom.commands.add('atom-workspace', {
						[`sparkling:${commandConfig.id}`]: command
					})
					workspaceView.classList.add(`sparkling-${commandConfig.id}`)
				} else {
					const { subscription } = commandConfig
					subscription && subscription.dispose()
					workspaceView.classList.remove(`sparkling-${commandConfig.id}`)
				}
			})
		})
	},

	activate() {
		this.subscriptions = new CompositeDisposable()

		if (atom.packages.hasActivatedInitialPackages()) {
			this.setup()
		} else {
			this.subscriptions.add(
				atom.packages.onDidActivateInitialPackages(() => this.setup())
			)
		}
	},

	deactivate() {
		this.subscriptions.dispose()
		this.commands.forEach(commandConfig => {
			const { subscription } = commandConfig
			subscription && subscription.dispose()
		})
	},

	serialize() {
		return {}
	}
}
