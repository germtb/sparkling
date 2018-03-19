// @flow

import { DEFAULT_SLICE_LENGTH } from '../constants'
import defaultRendererFactory from '../commands/renderers/defaultRenderer'

import type { Options, Dependencies, Item } from '../types'

export default <T: void>(dependencies: Dependencies) => (
	optionsFactory: Dependencies => {
		accept: (Item | Array<Item>) => void,
		description: string,
		id: string,
		loadData: (Array<Item>) => void
	}
): (T => void) => {
	const { store } = dependencies

	const defaultRenderer = defaultRendererFactory(dependencies)

	const defaults = {
		preview: null,
		sliceLength: DEFAULT_SLICE_LENGTH,
		columns: 1,
		renderer: defaultRenderer,
		multiselect: false,
		height: 200
	}

	const partialOptions = optionsFactory(dependencies)
	const options: Options = { ...defaults, ...partialOptions }

	const command = (extraOptions: T) => {
		const finalOptions = { ...options, ...extraOptions }
		store.dispatch({
			type: 'SHOW',
			payload: finalOptions
		})
	}

	return command
}
