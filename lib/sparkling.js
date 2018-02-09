import ReactDOM from 'react-dom'
import React, { PureComponent } from 'react'
import { Provider } from 'react-redux'
import path from 'path'
import fs from 'fs'
import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'
import dropRepeats from 'xstream/extra/dropRepeats'
import { CompositeDisposable } from 'atom'
import { createStore } from 'redux'
import util from 'util'
import { spawn } from 'child_process'

import SparklingContainer from './components/SparklingContainer'
import reducers from './reducers'
import {
	isVisible,
	getCMD,
	getAccept,
	getData,
	getIndex,
	getSparklingData,
	getSelectedValue
} from './selectors'

const store = createStore(reducers)

store.subscribe(() => {
	console.log(JSON.stringify(store.getState(), null, 2))
})

const fromSelector = selector => {
	let unsubscribe

	const producer = {
		start: listener => {
			unsubscribe = store.subscribe(() => {
				const state = store.getState()
				const selectedState = selector(state)
				listener.next(selectedState)
			})
		},
		stop: () => {
			unsubscribe && unsubscribe()
		}
	}

	return xs.create(producer)
}

fromSelector(isVisible)
	.compose(dropRepeats())
	.compose(sampleCombine(fromSelector(getCMD)))
	.filter(([visible, cmd]) => visible)
	.subscribe({
		next: ([visible, cmd]) => {
			const cmdName = cmd[0]
			const cmdArgs = cmd[1]

			const cwd = atom.project.getPaths()[0]
			const cmdProcess = spawn(...cmd, { cwd })

			cmdProcess.stdout.on('data', data => {
				store.dispatch({
					type: 'SET_DATA',
					payload: {
						data: data
							.toString('utf-8')
							.split('\n')
							.filter(s => s.length > 1)
					}
				})
			})
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

	const accept = getAccept(state)
	accept(value)
}

const sparkling = (cmd, accept, preview) => {
	if (isVisible(store.getState())) {
		store.dispatch({
			type: 'HIDE'
		})
	} else {
		store.dispatch({
			type: 'SHOW',
			payload: {
				cmd,
				accept,
				preview
			}
		})
	}
}

const gitBranches = () => {
	const cmd = ['git', ['branch']]
	const accept = value => {
		const cwd = atom.project.getPaths()[0]
		value = value.trim(0)

		if (/^\*/.test(value)) {
			console.log(`Already on ${value.substring(2)}`)
			return
		}

		const cmdProcess = spawn('git', ['checkout', value], { cwd })
		cmdProcess.stdout.on('data', () => {
			store.dispatch({
				type: 'HIDE'
			})
		})
	}

	sparkling(cmd, accept)
}

class PreviewFile extends PureComponent {
	constructor(props) {
		super(props)
		this.readFile = this.readFile.bind(this)
	}

	readFile() {
		const cwd = atom.project.getPaths()[0]
		const { file } = this.props

		fs.readFile(path.join(cwd, file), (err, data) => {
			if (err || !this.editor) {
				console.error(err)
			} else {
				const model = this.editor.getModel()
				const buffer = model.getBuffer()
				buffer.setText(data.toString('utf-8'))
			}
		})
	}

	componentDidMount() {
		this.readFile()
	}

	componentDidUpdate(prevProps) {
		if (prevProps.file === this.props.file) {
			return
		}

		this.readFile()
	}

	render() {
		return (
			<atom-text-editor
				class="editor"
				data-encoding="utf-8"
				ref={editor => (this.editor = editor)}
			/>
		)
	}
}

const files = () => {
	const cmd = ['rg', ['--files']]
	const accept = file => {
		atom.workspace.open(file)
		store.dispatch({
			type: 'HIDE'
		})
	}
	const preview = file => {
		return <PreviewFile file={file} />
	}

	sparkling(cmd, accept, preview)
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

		this.subscriptions = new CompositeDisposable()
		this.subscriptions.add(
			atom.commands.add('atom-workspace', {
				'sparkling:next': next,
				'sparkling:previous': previous,
				'sparkling:accept': accept,
				'sparkling:gitBranches': gitBranches,
				'sparkling:files': files,
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
