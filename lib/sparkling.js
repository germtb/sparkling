import { h, render } from 'preact'
import { Provider } from 'preact-redux'
import path from 'path'
import { CompositeDisposable } from 'atom'

import SparklingContainer from './components/SparklingContainer'
import SearchContainer from './components/SearchContainer'

import commandFactory from './commands/commandFactory'
import gitBranchesFactory from './commands/gitBranches'
import filesFactory from './commands/files'
import gitFilesFactory from './commands/gitFiles'
import linesFactory from './commands/lines'
import searchFactory from './commands/search'
import ls from './commands/ls'
import { allLinesFactory, autocompleteLinesFactory } from './commands/allLines'

import { setFileIconsService } from './utils'
import store from './store'

import config from './config'

import { next, previous, hide, accept } from './actions'
import { isSearchVisible, getOptions } from './selectors'

import setupObservables from './observables'

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
		return commandFactory
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

		const searchCommand = commandFactory(searchFactory)

		atom.commands.add('atom-workspace', {
			'sparkling:acceptSearch': searchCommand
		})

		atom.commands.add('atom-workspace', {
			'sparkling:search': searchToggle
		})

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

		atom.commands.add('atom-workspace', {
			'sparkling:ls': lsShow
		})

		atom.commands.add('atom-workspace', {
			'sparkling:lsUp': lsShowUp
		})

		this.commands.forEach(commandConfig => {
			atom.config.observe(`sparkling.${commandConfig.id}`, value => {
				if (value) {
					const command = commandFactory(commandConfig.factory)
					commandConfig.subscription = atom.commands.add('atom-workspace', {
						[`sparkling:${commandConfig.id}`]: () => command()
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
	},

	consumeFileIcons(service) {
		setFileIconsService(service)
	}
}
