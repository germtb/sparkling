import { DEFAULT_SLICE_LENGTH } from '../constants'
import defaultRendererFactory from '../commands/renderers/defaultRenderer'

export default dependencies => optionsFactory => {
	const { store } = dependencies

	const defaultRenderer = defaultRendererFactory(dependencies)

	const defaults = {
		preview: null,
		columns: 1,
		renderer: defaultRenderer,
		multiselect: false,
		rowHeight: 35
	}

	const partialOptions = optionsFactory(dependencies)
	const options = { ...defaults, ...partialOptions }

	const command = extraOptions => {
		const finalOptions = { ...options, ...extraOptions }
		store.dispatch({
			type: 'SHOW',
			payload: finalOptions
		})
	}

	return command
}
