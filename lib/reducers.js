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

const options = reducerCreator({
	SHOW: returnPayload()
})({})

const data = reducerCreator({
	SET_DATA: returnPayload('data')
})([])

const pattern = reducerCreator({
	SET_PATTERN: returnPayload('pattern'),
	SHOW: ''
})('')

const index = reducerCreator({
	SET_INDEX: returnPayload('value'),
	SET_DATA: 0,
	SET_PATTERN: 0
})(0)

export default combineReducers({
	visible,
	options,
	data,
	index,
	pattern
})
