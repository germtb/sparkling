import { h, render } from 'preact'
import { Provider } from 'preact-redux'
import { CompositeDisposable } from 'atom'

import Sparkling from './components/Sparkling'
import FindContainer from './components/FindContainer'
import ExtraInputContainer from './components/ExtraInputContainer'

import commandFactory from './commands/commandFactory'
import gitBranches from './commands/gitBranches'
import files from './commands/files'
import duplicateFiles from './commands/duplicateFiles'
import renameFiles from './commands/renameFiles'
import removeFiles from './commands/removeFiles'
import gitFiles from './commands/gitFiles'
import gitStage from './commands/gitStage'
import lines from './commands/lines'
import find from './commands/find'
import agFind from './commands/agFind'
import replace from './commands/replace'
import allLines from './commands/allLines'
import autocompleteLines from './commands/autocompleteLines'

import { setFileIconsService } from './utils'
import store from './store'
import config from './config'

import {
	next,
	previous,
	left,
	right,
	hide,
	accept,
	findToggle,
	lsShow,
	lsShowUp,
	duplicateFilesConfirm,
	renameFilesConfirm
} from './actions'

import setupObservables from './observables'

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
		{ id: 'find', command: find },
		{ id: 'replace', command: replace },
		{ id: 'agFind', command: agFind }
	],

	provideSparkling() {
		return commandFactory
	},

	setup() {
		const reactRoot = document.createElement('div')

		render(
			<Provider store={store}>
				<div>
					<Sparkling />
					<FindContainer />
					<ExtraInputContainer />
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
				'sparkling:left': left,
				'sparkling:right': right,
				'sparkling:accept': accept,
				'sparkling:hide': hide,
				'sparkling:removeFiles': removeFiles,
				'sparkling:duplicateFiles': duplicateFiles,
				'sparkling:duplicateFilesConfirm': duplicateFilesConfirm,
				'sparkling:renameFiles': renameFiles,
				'sparkling:renameFilesConfirm': renameFilesConfirm
			})
		)

		const workspaceView = atom.views.getView(atom.workspace)

		this.subscriptions.add(
			atom.commands.add('atom-workspace', {
				'sparkling:findToggle': findToggle
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
