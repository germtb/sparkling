// @flow

import { DEFAULT_SLICE_LENGTH } from '../constants'
import defaultRendererFactory from '../commands/renderers/defaultRenderer'

import type { Options, Dependencies, ItemArray } from '../types'

export default <T: void>(dependencies: Dependencies) => (
	optionsFactory: Dependencies => {
		accept: ItemArray => void,
		description: string,
		id: string,
		loadData: ItemArray => void
	}
): (T => void) => {
	const { store } = dependencies

	const defaultRenderer = defaultRendererFactory(dependencies)

	const defaults = {
		preview: null,
		sliceLength: DEFAULT_SLICE_LENGTH,
		columns: 1,
		renderer: defaultRenderer,
		multiselect: false
	}

	const partialOptions = optionsFactory(dependencies)
	const options: any = { ...defaults, ...partialOptions }

	const command = (extraOptions: T) => {
		const finalOptions = { ...options, ...extraOptions }
		store.dispatch({
			type: 'SHOW',
			payload: finalOptions
		})
	}

	return command
}
