import { CompositeDisposable } from 'atom'

import commandFactory from './commands/commandFactory'
import files from './commands/files'
import copyFiles from './commands/copyFiles'
import moveFiles from './commands/moveFiles'
import removeFiles from './commands/removeFiles'
import gitFiles from './commands/gitFiles'
import gitBranches from './commands/gitBranches'
import gitLog from './commands/gitLog'
import gitLogCheckout from './commands/gitLogCheckout'
import gitStage from './commands/gitStage'
import gitCheckout from './commands/gitCheckout'
import gitReflog from './commands/gitReflog'
import lines from './commands/lines'
import find from './commands/find'
import replace from './commands/replace'
import allLines from './commands/allLines'
import autocompleteLines from './commands/autocompleteLines'

import { setFileIconsService } from './utils'
import config from './config'
import loadView from './loadView'

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
	moveFilesConfirm
} from './actions'

module.exports = {
	subscriptions: null,

	config,

	provideSparkling() {
		return commandFactory
	},

	setup() {
		loadView()

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
				'sparkling:gitLogCheckout': gitLogCheckout,
				'sparkling:gitCheckout': gitCheckout,
				'sparkling:gitReflog': gitReflog,
				'sparkling:lines': lines,
				'sparkling:allLines': allLines,
				'sparkling:autocompleteLines': autocompleteLines,
				'sparkling:find': find,
				'sparkling:replace': replace,
				'sparkling:ls': lsShow,
				'sparkling:lsUp': lsShowUp,
				'sparkling:removeFiles': removeFiles,
				'sparkling:moveFiles': moveFiles,
				'sparkling:moveFilesConfirm': moveFilesConfirm,
				'sparkling:copyFiles': copyFiles,
				'sparkling:copyFilesConfirm': copyFilesConfirm,
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
