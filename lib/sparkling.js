import path from 'path'

import { CompositeDisposable } from 'atom'

import files from './commands/files'
import ls from './commands/ls'
import copyFiles from './commands/copyFiles'
import moveFiles from './commands/moveFiles'
import removeFiles from './commands/removeFiles'
import relativePathInsert from './commands/relativePathInsert'
import relativePathCopy from './commands/relativePathCopy'
import gitFiles from './commands/gitFiles'
import gitBranches from './commands/gitBranches'
import gitLog from './commands/gitLog'
import gitLogCheckout from './commands/gitLogCheckout'
import gitStage from './commands/gitStage'
import gitCheckout from './commands/gitCheckout'
import gitReflog from './commands/gitReflog'
import gitReflogCheckout from './commands/gitReflogCheckout'
import lines from './commands/lines'
import find from './commands/find'
import replace from './commands/replace'
import allLines from './commands/allLines'
import autocompleteLines from './commands/autocompleteLines'

import { setFileIconsService } from './utils'
import config from './config'
import render from './render'

import { getOptions } from './selectors'

import dependenciesFactory from './dependencies'

import {
	next,
	previous,
	left,
	right,
	hide,
	accept,
	findToggle,
	copyFilesConfirm,
	moveFilesConfirm,
	togglePattern
} from './thunks'

module.exports = {
	subscriptions: null,

	config,

	provideSparkling() {
		return this.commandFactory
	},

	bootstrap() {
		const dependencies = dependenciesFactory()

		const { store, fromAction, commandFactory } = dependencies

		this.commandFactory = commandFactory

		fromAction('HIDE').subscribe(() => {
			const editor = atom.workspace.getActiveTextEditor()
			const view = editor && atom.views.getView(editor)
			view && view.focus()
		})

		const reactRoot = document.createElement('div')

		render(reactRoot, dependencies)

		atom.workspace.addBottomPanel({ item: reactRoot, model: {} })

		const filesCommand = this.commandFactory(files)
		const relativePathInsertCommand = this.commandFactory(relativePathInsert)
		const relativePathCopyCommand = this.commandFactory(relativePathCopy)
		const gitFilesCommand = this.commandFactory(gitFiles)
		const gitStageCommand = this.commandFactory(gitStage)
		const gitBranchesCommand = this.commandFactory(gitBranches)
		const gitLogCommand = this.commandFactory(gitLog)
		const gitLogCheckoutCommand = this.commandFactory(gitLogCheckout)
		const gitCheckoutCommand = this.commandFactory(gitCheckout)
		const gitReflogCommand = this.commandFactory(gitReflog)
		const gitReflogCheckoutCommand = this.commandFactory(gitReflogCheckout)
		const linesCommand = this.commandFactory(lines)
		const allLinesCommand = this.commandFactory(allLines)
		const autocompleteLinesCommand = this.commandFactory(autocompleteLines)
		const findCommand = this.commandFactory(find)
		const replaceCommand = this.commandFactory(replace)
		const removeFilesCommand = this.commandFactory(removeFiles)
		const moveFilesCommand = this.commandFactory(moveFiles)
		const copyFilesCommand = this.commandFactory(copyFiles)
		const lsCommand = this.commandFactory(ls)

		const onDone = extraInput => {
			store.dispatch({ type: 'HIDE' })
			atom.workspace.open(extraInput.value)
		}

		this.subscriptions.add(
			atom.commands.add('atom-workspace', {
				'sparkling:files': filesCommand,
				'sparkling:relativePathInsert': relativePathInsertCommand,
				'sparkling:relativePathCopy': relativePathCopyCommand,
				'sparkling:gitFiles': gitFilesCommand,
				'sparkling:gitStage': gitStageCommand,
				'sparkling:gitBranches': gitBranchesCommand,
				'sparkling:gitLog': gitLogCommand,
				'sparkling:gitLogCheckout': gitLogCheckoutCommand,
				'sparkling:gitCheckout': gitCheckoutCommand,
				'sparkling:gitReflog': gitReflogCommand,
				'sparkling:gitReflogCheckout': gitReflogCheckoutCommand,
				'sparkling:lines': linesCommand,
				'sparkling:allLines': allLinesCommand,
				'sparkling:autocompleteLines': autocompleteLinesCommand,
				'sparkling:find': findCommand,
				'sparkling:replace': replaceCommand,
				'sparkling:removeFiles': removeFilesCommand,
				'sparkling:moveFiles': moveFilesCommand,
				'sparkling:copyFiles': copyFilesCommand,
				'sparkling:toggleSelfFind': () => {
					const editor = atom.workspace.getActiveTextEditor()
					const cwd = atom.project.getPaths()[0]
					const self = editor ? editor.getPath() : atom.project.getPaths()[0]

					let pattern = cwd === self ? cwd : self.replace(cwd, '')

					if (pattern[0] === '/') {
						pattern = pattern.slice(1)
					}

					store.dispatch(togglePattern({ pattern }))
				},
				'sparkling:next': () => store.dispatch(next()),
				'sparkling:previous': () => store.dispatch(previous()),
				'sparkling:left': () => store.dispatch(left()),
				'sparkling:right': () => store.dispatch(right()),
				'sparkling:accept': () => store.dispatch(accept()),
				'sparkling:hide': () => store.dispatch(hide()),
				'sparkling:ls': () => {
					const activeTextEditor = atom.workspace.getActiveTextEditor()
					const finalPath = activeTextEditor
						? path.dirname(activeTextEditor.getPath())
						: atom.project.getPaths()[0]

					lsCommand({ path: finalPath, description: finalPath, lsCommand })
				},
				'sparkling:lsUp': () => {
					const { path: optionsPath } = getOptions(store.getState())
					const finalPath = path.resolve(optionsPath, '..')

					lsCommand({ path: finalPath, description: finalPath, lsCommand })
				},
				'sparkling:moveFilesConfirm': () =>
					store.dispatch(moveFilesConfirm(onDone)),
				'sparkling:copyFilesConfirm': () =>
					store.dispatch(copyFilesConfirm(onDone)),
				'sparkling:findToggle': () => {
					const editor = atom.workspace.getActiveTextEditor()
					const find = editor ? editor.getSelectedText() : ''
					const scope = ''

					store.dispatch(findToggle({ find, scope }))
				},
				'sparkling:findInBufferToggle': () => {
					const editor = atom.workspace.getActiveTextEditor()
					const find = editor ? editor.getSelectedText() : ''
					const cwd = atom.project.getPaths()[0]
					const scope = editor ? editor.getPath().replace(cwd, '') : ''

					store.dispatch(findToggle({ find, scope }))
				}
			})
		)
	},

	activate() {
		this.subscriptions = new CompositeDisposable()

		if (atom.packages.hasActivatedInitialPackages()) {
			this.bootstrap()
		} else {
			this.subscriptions.add(
				atom.packages.onDidActivateInitialPackages(() => this.bootstrap())
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
