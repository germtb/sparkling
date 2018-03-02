import React from 'react'
import { DEFAULT_SLICE_LENGTH } from '../constants'
import defaultRenderer from './renderers/defaultRenderer'

export default store => optionsFactory => {
	const defaults = {
		preview: null,
		sliceLength: DEFAULT_SLICE_LENGTH,
		columns: 1,
		defaultRenderer
	}

	const options = { ...defaults, ...optionsFactory(React, store) }

	const command = (extraOptions = {}) => {
		const finalOptions = { ...options, ...extraOptions }

		store.dispatch({
			type: 'SHOW',
			payload: finalOptions
		})
	}

	return command
}
