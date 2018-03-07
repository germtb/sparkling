// @flow

import { DEFAULT_SLICE_LENGTH } from '../constants'
import defaultRendererFactory from '../commands/renderers/defaultRenderer'

import type { Options, PartialOptions, Dependencies } from '../types'

export default <T: void>(dependencies: Dependencies) => (
	optionsFactory: Dependencies => PartialOptions
): (T => void) => {
	const { store } = dependencies

	const defaultRenderer = defaultRendererFactory(dependencies)

	const defaults = {
		preview: null,
		sliceLength: DEFAULT_SLICE_LENGTH,
		columns: 1,
		renderer: defaultRenderer
	}

	const partialOptions = optionsFactory(dependencies)
	const options: Options = { ...defaults, ...partialOptions }

	const command = (extraOptions: T) => {
		const finalOptions = { ...options, ...extraOptions }
		store.dispatch({
			type: 'SHOW',
			payload: finalOptions
		})

		const sparklingInput = document.getElementById('sparkling-input')
		sparklingInput && sparklingInput.focus()
	}

	return command
}
