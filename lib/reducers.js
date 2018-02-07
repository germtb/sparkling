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

const data = reducerCreator({
	SET_DATA: returnPayload('data')
})([])

export default combineReducers({ visible, cmd, data })
