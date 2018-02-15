import store from './store'
import {
	getOptions,
	getIndex,
	getOffset,
	getSparklingData,
	getSelectedValue
} from './selectors'

export const next = () => {
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
