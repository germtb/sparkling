import { h, render } from 'preact'
import { Provider } from 'preact-redux'
import { CompositeDisposable } from 'atom'

import Sparkling from './components/Sparkling'
import FindContainer from './components/FindContainer'
import ExtraInputContainer from './components/ExtraInputContainer'

import commandFactory from './commands/commandFactory'
import files from './commands/files'
import copyFiles from './commands/copyFiles'
import renameFiles from './commands/renameFiles'
import moveFiles from './commands/moveFiles'
import removeFiles from './commands/removeFiles'
import gitFiles from './commands/gitFiles'
import gitBranches from './commands/gitBranches'
import gitLog from './commands/gitLog'
import gitCommits from './commands/gitCommits'
import gitStage from './commands/gitStage'
import lines from './commands/lines'
import find from './commands/find'
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
	copyFilesConfirm,
	moveFilesConfirm,
	renameFilesConfirm
} from './actions'

import setupObservables from './observables'

module.exports = {
	subscriptions: null,

	config,

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
				'sparkling:files': files,
				'sparkling:gitFiles': gitFiles,
				'sparkling:gitStage': gitStage,
				'sparkling:gitBranches': gitBranches,
				'sparkling:gitLog': gitLog,
				'sparkling:gitCommits': gitCommits,
				'sparkling:lines': lines,
				'sparkling:allLines': allLines,
				'sparkling:autocompleteLines': autocompleteLines,
				'sparkling:find': find,
				'sparkling:replace': replace,
				'sparkling:ls': lsShow,
				'sparkling:lsUp': lsShowUp,
				'sparkling:removeFiles': removeFiles,
				'sparkling:moveFiles': moveFiles,
				'sparkling:copyFiles': copyFiles,
				'sparkling:copyFilesConfirm': copyFilesConfirm,
				'sparkling:moveFilesConfirm': moveFilesConfirm,
				'sparkling:renameFiles': renameFiles,
				'sparkling:renameFilesConfirm': renameFilesConfirm,
				'sparkling:findToggle': () => findToggle(),
				'sparkling:findInBufferToggle': () => findToggle({ inBuffer: true })
			})
		)
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
		this.subscriptions = null
	},

	serialize() {
		return {}
	},

	consumeFileIcons(service) {
		setFileIconsService(service)
	}
}
