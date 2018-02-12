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
	APPEND_DATA: (state, { data }) => state.concat(data),
	SHOW: []
})([])

const sparklingData = reducerCreator({
	SET_FILTERED_DATA: returnPayload('data')
})([])

const pattern = reducerCreator({
	SET_PATTERN: returnPayload('pattern'),
	SHOW: ''
})('')

const index = reducerCreator({
	SET_INDEX: returnPayload('value'),
	SET_DATA: 0,
	SET_PATTERN: 0,
	SHOW: 0
})(0)

const offset = reducerCreator({
	SET_OFFSET: returnPayload('value'),
	SET_DATA: 0,
	SET_PATTERN: 0,
	SHOW: 0
})(0)

export default combineReducers({
	visible,
	options,
	data,
	sparklingData,
	index,
	offset,
	pattern
})
