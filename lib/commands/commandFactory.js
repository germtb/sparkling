import { h } from 'preact'
import store from '../store'
import { isVisible, getOptions } from '../selectors'
import { DEFAULT_SLICE_LENGTH } from '../constants'
import defaultRenderer from './renderers/defaultRenderer'

export default optionsFactory => {
	const {
		loadData,
		accept,
		renderer = defaultRenderer,
		preview = null,
		sliceLength = DEFAULT_SLICE_LENGTH,
		columns = 1,
		...extraOptions
	} = optionsFactory(h, store)

	let options = {
		loadData,
		accept,
		renderer,
		preview,
		sliceLength,
		columns,
		...extraOptions
	}

	return extraOptions => {
		options = extraOptions ? { ...options, ...extraOptions } : options

		const state = store.getState()

		if (isVisible(state)) {
			const storeOptions = getOptions(state)
			const sparklingInput = document.getElementById('sparkling-input')

			if (storeOptions === options) {
				if (sparklingInput === document.activeElement) {
					store.dispatch({
						type: 'HIDE'
					})
				} else {
					sparklingInput.focus()
				}
			} else {
				store.dispatch({
					type: 'SHOW',
					payload: options
				})
				sparklingInput.focus()
			}
		} else {
			store.dispatch({
				type: 'SHOW',
				payload: options
			})
		}
	}
}
