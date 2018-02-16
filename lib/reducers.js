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
	HIDE: false,
	SHOW_SEARCH: false,
	HIDE_SEARCH: false
})(false)

const findVisible = reducerCreator({
	SHOW_SEARCH: true,
	HIDE_SEARCH: false,
	SHOW: false,
	HIDE: false
})(false)

const find = reducerCreator({
	SHOW_SEARCH: returnPayload('find'),
	SET_SEARCH: returnPayload('find')
})('')

const replace = reducerCreator({
	SHOW_SEARCH: '',
	SET_REPLACE: returnPayload('replace')
})('')

const options = reducerCreator({
	SHOW: returnPayload()
})({})

const data = reducerCreator({
	APPEND_DATA: (state, { data }) => state.concat(data),
	SHOW: [],
	HIDE: [],
	SHOW_SEARCH: [],
	RELOAD: [],
	REMOVE_ITEM: (state, item) => state.filter(x => x !== item)
})([])

const sparklingData = reducerCreator({
	SET_FILTERED_DATA: returnPayload('data'),
	SHOW: [],
	HIDE: [],
	SHOW_SEARCH: [],
	RELOAD: [],
	REMOVE_ITEM: (state, item) => state.filter(x => x !== item)
})([])

const pattern = reducerCreator({
	SET_PATTERN: (state, { pattern }) => ({ ...state, value: pattern }),
	SHOW: state => ({ ...state, value: '' })
	// SHOW: (state, { id }) => {
	// 	if (state.id === id) {
	// 		return state
	// 	}
	//
	// 	return {
	// 		value: '',
	// 		id
	// 	}
	// }
})({ value: '', id: '' })

const index = reducerCreator({
	SET_INDEX: returnPayload('value'),
	SET_DATA: 0,
	SET_PATTERN: 0,
	SHOW: 0,
	REMOVE_ITEM: 0
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
	pattern,
	findVisible,
	find,
	replace
})
