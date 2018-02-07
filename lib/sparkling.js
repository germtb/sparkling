import ReactDOM from 'react-dom'
import React from 'react'
import { Provider } from 'react-redux'
import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'
import dropRepeats from 'xstream/extra/dropRepeats'
import { CompositeDisposable } from 'atom'
import { createStore } from 'redux'
import util from 'util'
import { spawn } from 'child_process'

import SparklingView from './sparkling-view'
import reducers from './reducers'
import { isVisible, getCMD } from './selectors'

module.exports = {
	subscriptions: null,

	activate() {
		this.store = createStore(reducers)
		const reactRoot = document.createElement('div')

		this.store.subscribe(() => {
			console.log(JSON.stringify(this.store.getState(), null, 2))
		})

		const fromSelector = selector => {
			const producer = {
				start: listener => {
					this.store.subscribe(() => {
						const state = this.store.getState()
						const selectedState = selector(state)
						listener.next(selectedState)
					})
				}
			}

			return xs.create(producer)
		}

		const $visible = fromSelector(isVisible)
		const $cmd = fromSelector(getCMD)

		$visible
			.compose(dropRepeats())
			.compose(sampleCombine($cmd))
			.filter(([visible, cmd]) => visible)
			.subscribe({
				next: ([visible, cmd]) => {
					const state = this.store.getState()

					const cmdName = cmd[0]
					const cmdArgs = cmd[1]

					const cwd = atom.project.getPaths()[0]
					const cmdProcess = spawn(cmdName, cmdArgs, { cwd })

					cmdProcess.stdout.on('data', data => {
						this.store.dispatch({
							type: 'SET_DATA',
							payload: { data: data.toString('utf-8').split('\n') }
						})
					})
				}
			})

		ReactDOM.render(
			<Provider store={this.store}>
				<SparklingView />
			</Provider>,
			reactRoot
		)
		atom.workspace.addBottomPanel({ item: reactRoot, model: {} })

		this.subscriptions = new CompositeDisposable()
		this.subscriptions.add(
			atom.commands.add('atom-workspace', {
				// 'sparkling:next': this.next.bind(this),
				// 'sparkling:previous': this.previous.bind(this),
				// 'sparkling:accept': this.accept.bind(this),
				// 'sparkling:files': this.files.bind(this)
				'sparkling:gitBranches': this.gitBranches.bind(this)
			})
		)
	},

	onChange(...things) {
		const state = this.store.getState()

		// console.log(JSON.stringify(state, null, 2))

		const cmd = getCMD(state)
		const visible = isVisible(state)

		if (!visible || cmd === '') {
			return
		}

		const cmdName = cmd[0]
		const cmdArgs = cmd[1]

		// console.log('cmdName: ', cmdName)
		// console.log('cmdArgs: ', cmdArgs)

		const cwd = atom.project.getPaths()[0]
		const cmdProcess = spawn(cmdName, cmdArgs, { cwd })

		cmdProcess.stdout.on('data', data => {
			// console.log('stdout: ' + data)
			this.store.dispatch({
				type: 'SET_DATA',
				payload: { data }
			})
		})

		cmdProcess.on('exit', function(code) {
			// console.log('child process exited with code ' + code)
		})
	},

	gitBranches() {
		if (isVisible(this.store.getState())) {
			this.store.dispatch({
				type: 'HIDE'
			})
		} else {
			this.store.dispatch({
				type: 'SHOW',
				payload: { cmd: ['git', ['branch']] }
			})
		}
	},

	files() {
		if (isVisible(this.store.getState())) {
			this.store.dispatch({
				type: 'HIDE'
			})
		} else {
			this.store.dispatch({
				type: 'SHOW',
				payload: { cmd: ['rg', ['--files']] }
			})
		}
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
