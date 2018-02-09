import { combineReducers } from 'redux'

const reducerCreator = actions => initialState => (
	state = initialState,
	{ type, payload }
) => {
	const action = actions[type]

	if (action !== null && action !== undefined) {
		return typeof action === 'function' ? action(state, payload) : action
	}

	return state
}

const returnPayload = field => (state, payload) =>
	field ? payload[field] : payload

const visible = reducerCreator({
	SHOW: true,
	HIDE: false
})(false)

const cmd = reducerCreator({
	SHOW: returnPayload('cmd')
})('')

const accept = reducerCreator({
	SHOW: returnPayload('accept')
})(x => x)

const preview = reducerCreator({
	SHOW: (state, payload) => {
		if (payload && payload.preview) {
			return payload.preview
		}

		return null
	}
})(null)

const data = reducerCreator({
	SET_DATA: returnPayload('data')
})([])

const pattern = reducerCreator({
	SET_PATTERN: returnPayload('pattern'),
	SHOW: ''
})('')

const index = reducerCreator({
	SET_INDEX: returnPayload('value'),
	SET_DATA: 0
})(0)

export default combineReducers({
	visible,
	cmd,
	accept,
	preview,
	data,
	index,
	pattern
})
