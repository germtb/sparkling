import { h, render } from 'preact'
import { Provider } from 'preact-redux'
import path from 'path'
import { CompositeDisposable } from 'atom'

import SparklingContainer from './components/SparklingContainer'
import SearchContainer from './components/SearchContainer'
import ReplaceContainer from './components/ReplaceContainer'

import commandFactory from './commands/commandFactory'
import gitBranches from './commands/gitBranches'
import files from './commands/files'
import gitFiles from './commands/gitFiles'
import gitStage from './commands/gitStage'
import lines from './commands/lines'
import search from './commands/search'
import replace from './commands/replace'
import ls from './commands/ls'
import allLines from './commands/allLines'
import autocompleteLines from './commands/autocompleteLines'

import { setFileIconsService } from './utils'
import store from './store'

import config from './config'

import { next, previous, hide, accept } from './actions'
import { isSearchVisible, getOptions, isReplaceVisible } from './selectors'

import setupObservables from './observables'

const searchToggle = () => {
	if (isSearchVisible(store.getState())) {
		store.dispatch({ type: 'HIDE_SEARCH' })
	} else {
		store.dispatch({ type: 'SHOW_SEARCH' })
	}
}

const replaceToggle = () => {
	if (isReplaceVisible(store.getState())) {
		store.dispatch({ type: 'HIDE_REPLACE' })
	} else {
		store.dispatch({ type: 'SHOW_REPLACE' })
	}
}

const lsShow = () => {
	const activeTextEditor = atom.workspace.getActiveTextEditor()
	const finalPath = activeTextEditor
		? path.dirname(activeTextEditor.getPath())
		: atom.project.getPaths()[0]
	ls({ path: finalPath })
}

const lsShowUp = () => {
	const { path: optionsPath } = getOptions(store.getState())
	const finalPath = path.resolve(optionsPath, '..')
	ls({ path: finalPath })
}

module.exports = {
	subscriptions: null,

	config,

	commands: [
		{ id: 'files', command: files },
		{ id: 'gitFiles', command: gitFiles },
		{ id: 'gitStage', command: gitStage },
		{ id: 'gitBranches', command: gitBranches },
		{ id: 'lines', command: lines },
		{ id: 'allLines', command: allLines },
		{ id: 'autocompleteLines', command: autocompleteLines },
		{ id: 'search', command: search },
		{ id: 'replace', command: replace }
	],

	provideSparkling() {
		return commandFactory
	},

	setup() {
		const reactRoot = document.createElement('div')

		render(
			<Provider store={store}>
				<div>
					<SparklingContainer />
					<SearchContainer />
					<ReplaceContainer />
				</div>
			</Provider>,
			reactRoot
		)

		setupObservables()

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

		this.subscriptions.add(
			atom.commands.add('atom-workspace', {
				'sparkling:searchToggle': searchToggle
			})
		)

		this.subscriptions.add(
			atom.commands.add('atom-workspace', {
				'sparkling:replaceToggle': replaceToggle
			})
		)

		atom.commands.add('atom-workspace', {
			'sparkling:ls': lsShow
		})

		atom.commands.add('atom-workspace', {
			'sparkling:lsUp': lsShowUp
		})

		this.commands.forEach(commandConfig => {
			const { id, command } = commandConfig
			atom.config.observe(`sparkling.${commandConfig.id}`, value => {
				if (value) {
					commandConfig.subscription = atom.commands.add('atom-workspace', {
						[`sparkling:${id}`]: () => command()
					})
					workspaceView.classList.add(`sparkling-${id}`)
				} else {
					const { subscription } = commandConfig
					subscription && subscription.dispose()
					workspaceView.classList.remove(`sparkling-${id}`)
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
	},

	consumeFileIcons(service) {
		setFileIconsService(service)
	}
}
