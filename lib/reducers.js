const reducerCreator = reducers => initialState => (
	state = initialState,
	action
) => {
	const reducer = reducers[action.type]

	if (reducer !== null && reducer !== undefined) {
		return typeof reducer === 'function' ? reducer(state, action) : reducer
	}

	return state
}

const returnPayload = field => (state, { payload }) => payload[field]

const visible = reducerCreator({
	SHOW: true,
	HIDE: false,
	SHOW_SEARCH: false,
	SHOW_EXTRA_INPUT: false
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
	SHOW: (state, { payload }) => payload
})({
	loadData: () => () => {},
	accept: () => {},
	renderer: () => {},
	sliceLength: 18,
	columns: 3,
	description: '',
	id: '',
	multiselect: true
})

const data = reducerCreator({
	APPEND_DATA: (state, { payload: { data, set } }) =>
		set ? data : state.concat(data),
	SHOW: [],
	HIDE: [],
	SHOW_SEARCH: [],
	RELOAD: [],
	REMOVE_ITEM: (state, { payload: { item } }) => state.filter(x => x !== item)
})([])

const sparklingData = reducerCreator({
	APPEND_FILTERED_DATA: (state, { payload: { data, set } }) =>
		set ? data : state.concat(data),
	SHOW: [],
	HIDE: [],
	SHOW_SEARCH: [],
	RELOAD: [],
	REMOVE_ITEM: (state, { payload: { item } }) => state.filter(x => x !== item)
})([])

const pattern = reducerCreator({
	SET_PATTERN: (state, { payload: { pattern } }) => ({
		...state,
		value: pattern
	}),
	SHOW: state => ({ ...state, value: '' })
})({ value: '', id: '' })

const index = reducerCreator({
	SET_INDEX: returnPayload('value'),
	SET_DATA: 0,
	SET_PATTERN: 0,
	SHOW: 0,
	REMOVE_ITEM: 0
})(0)

const extraInput = reducerCreator({
	SHOW_EXTRA_INPUT: (state, { payload }) => ({ ...state, ...payload }),
	SET_EXTRA_INPUT: (state, { payload }) => ({ ...state, ...payload }),
	HIDE: {}
})({})

const smartCase = reducerCreator({
	TOGGLE_SMART_CASE: state => !state
})(true)

const literalSearch = reducerCreator({
	TOGGLE_LITERAL_SEARCH: state => !state
})(false)

const wholeWord = reducerCreator({
	TOGGLE_WHOLE_WORD: state => !state
})(false)

const scope = reducerCreator({
	SHOW_SEARCH: returnPayload('scope'),
	SET_SCOPE: returnPayload('scope')
})('')

const multiselected = reducerCreator({
	SHOW: [],
	SELECT: (state, { payload: { item } }) =>
		state.includes(item) ? state.filter(x => x !== item) : [...state, item]
})([])

const reducers = {
	visible,
	options,
	data,
	sparklingData,
	index,
	pattern,
	find,
	replace,
	extraInput,
	smartCase,
	literalSearch,
	scope,
	wholeWord,
	multiselected
}

export default reducers
