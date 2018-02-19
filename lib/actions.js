import path from 'path'

import store from './store'
import {
	getOptions,
	getIndex,
	getOffset,
	getSparklingData,
	getSelectedValue,
	getExtraInput,
	isFindVisible
} from './selectors'
import ls from './commands/ls'
import { spawnInProject } from './utils'

export const next = () => {
	const state = store.getState()
	const index = getIndex(state)
	const sparklingData = getSparklingData(state)
	const options = getOptions(state)
	const { sliceLength } = options

	if (index === sliceLength - 1) {
		const offset = getOffset(state)
		const value = Math.min(offset + 1, sparklingData.length - sliceLength)
		store.dispatch({ type: 'SET_OFFSET', payload: { value } })
	} else {
		const value = Math.min(index + 1, sparklingData.length - 1, sliceLength - 1)
		store.dispatch({ type: 'SET_INDEX', payload: { value } })
	}
}

export const previous = () => {
	const state = store.getState()
	const index = getIndex(state)

	if (index === 0) {
		const offset = getOffset(state)
		const value = Math.max(offset - 1, 0)
		store.dispatch({ type: 'SET_OFFSET', payload: { value } })
	} else {
		const value = Math.max(index - 1, 0)
		store.dispatch({ type: 'SET_INDEX', payload: { value } })
	}
}

export const left = () => {
	const state = store.getState()
	const index = getIndex(state)
	const options = getOptions(state)
	const { columns, sliceLength } = options
	const rows = sliceLength / columns

	if (index === 0) {
		const offset = getOffset(state)
		const value = Math.max(offset - rows, 0)
		store.dispatch({ type: 'SET_OFFSET', payload: { value } })
	} else {
		const value = Math.max(index - rows, 0)
		store.dispatch({ type: 'SET_INDEX', payload: { value } })
	}
}

export const right = () => {
	const state = store.getState()
	const index = getIndex(state)
	const sparklingData = getSparklingData(state)
	const options = getOptions(state)
	const { sliceLength, columns } = options
	const rows = sliceLength / columns

	if (index === sliceLength - 1) {
		const offset = getOffset(state)
		const value = Math.min(offset + rows, sparklingData.length - sliceLength)
		store.dispatch({ type: 'SET_OFFSET', payload: { value } })
	} else {
		const value = Math.min(
			index + rows,
			sparklingData.length - 1,
			sliceLength - 1
		)
		store.dispatch({ type: 'SET_INDEX', payload: { value } })
	}
}

export const hide = () => {
	store.dispatch({ type: 'HIDE' })
}

export const accept = () => {
	const state = store.getState()
	const value = getSelectedValue(state)

	if (value === null || value === undefined) {
		return
	}

	const { accept } = getOptions(state)
	accept(value)
}

export const findToggle = ({ inBuffer } = {}) => {
	const findInput = document.querySelector(
		'#sparkling-project-find #sparkling-input'
	)
	const replaceInput = document.querySelector(
		'#sparkling-project-replace #sparkling-input'
	)

	if (findInput && findInput !== document.activeElement) {
		findInput.focus()
	} else if (replaceInput && replaceInput !== document.activeElement) {
		replaceInput.focus()
	} else if (isFindVisible(store.getState())) {
		store.dispatch({ type: 'HIDE_SEARCH' })
	} else {
		const editor = atom.workspace.getActiveTextEditor()
		const find = editor ? editor.getSelectedText() : ''
		const scope = inBuffer && editor ? editor.getPath() : ''
		store.dispatch({ type: 'SHOW_SEARCH', payload: { find, scope } })
	}
}

export const lsShow = () => {
	const activeTextEditor = atom.workspace.getActiveTextEditor()
	const finalPath = activeTextEditor
		? path.dirname(activeTextEditor.getPath())
		: atom.project.getPaths()[0]
	ls({ path: finalPath, description: finalPath })
}

export const lsShowUp = () => {
	const { path: optionsPath } = getOptions(store.getState())
	const finalPath = path.resolve(optionsPath, '..')
	ls({ path: finalPath, description: finalPath })
}

export const duplicateFilesConfirm = () => {
	const extraInput = getExtraInput(store.getState())
	const cmdProcess = spawnInProject('cp', [
		extraInput.originPath,
		extraInput.value
	])
	cmdProcess.on('exit', () => {
		atom.workspace.open(extraInput.value)
	})
	store.dispatch({ type: 'HIDE' })
}

export const renameFilesConfirm = () => {
	const extraInput = getExtraInput(store.getState())
	const cmdProcess = spawnInProject('mv', [
		extraInput.originPath,
		extraInput.value
	])
	cmdProcess.on('exit', () => {
		atom.workspace.open(extraInput.value)
	})
	store.dispatch({ type: 'HIDE' })
}
