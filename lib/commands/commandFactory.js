import { h } from 'preact'
import store from '../store'
import { isVisible, getOptions } from '../selectors'
import defaultRenderer from './renderers/defaultRenderer'

export default optionsFactory => {
	const {
		loadData,
		accept,
		renderer = defaultRenderer,
		preview = null,
		...extraOptions
	} = optionsFactory(h, store)

	let options = {
		loadData,
		accept,
		renderer,
		preview,
		...extraOptions
	}

	return extras => {
		options = extras ? { ...options, ...extras } : options

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
