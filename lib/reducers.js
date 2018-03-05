// @flow

import type { ActionType, ActionWithPayload, Options, Item } from './types'
import type { Reducer } from 'redux'

const reducerCreator2 = reducers => initialState => (
	state = initialState,
	action
) => {
	const reducer = reducers[action.type]

	if (reducer !== null && reducer !== undefined) {
		return typeof reducer === 'function' ? reducer(state, action) : reducer
	}

	return state
}

const reducerCreator = <S, A: *>(reducers: {
	[ActionType]: Reducer<S, A> | S
}): (S => Reducer<S, A>) => (initialState: S): Reducer<S, A> => (
	state: S = initialState,
	action: A
): S => {
	const reducer = reducers[action.type]

	if (reducer !== null && reducer !== undefined) {
		return typeof reducer === 'function' ? reducer(state, action) : reducer
	}

	return state
}

const returnPayload = <S, A: ActionWithPayload>(
	field: string
): Reducer<S, A> => (state, { payload }): S => payload[field]

const visible: Reducer<boolean, *> = reducerCreator({
	SHOW: true,
	HIDE: false,
	SHOW_SEARCH: false,
	SHOW_INPUT: false
})(false)

const findVisible: Reducer<boolean, *> = reducerCreator({
	SHOW_SEARCH: true,
	SHOW: false,
	HIDE: false
})(false)

const find: Reducer<string, *> = reducerCreator({
	SHOW_SEARCH: returnPayload('find'),
	SET_SEARCH: returnPayload('find')
})('')

const replace: Reducer<string, *> = reducerCreator({
	SHOW_SEARCH: '',
	SET_REPLACE: returnPayload('replace')
})('')

const options: Reducer<Options, *> = reducerCreator({
	SHOW: (state, { payload }) => payload
})({
	loadData: () => {},
	accept: () => {},
	renderer: () => {},
	sliceLength: 20,
	columns: 4,
	description: '',
	id: ''
})

const data: Reducer<Array<Item>, *> = reducerCreator({
	APPEND_DATA: (state, { payload: { data } }) => state.concat(data),
	SHOW: [],
	HIDE: [],
	SHOW_SEARCH: [],
	RELOAD: [],
	REMOVE_ITEM: (state, { payload: { item } }) => state.filter(x => x !== item)
})([])

const sparklingData: Reducer<Array<Item>, *> = reducerCreator({
	SET_FILTERED_DATA: returnPayload('data'),
	SHOW: [],
	HIDE: [],
	SHOW_SEARCH: [],
	RELOAD: [],
	REMOVE_ITEM: (state, { payload: { item } }) => state.filter(x => x !== item)
})([])

const pattern: Reducer<{ value: string, id: string }, *> = reducerCreator({
	SET_PATTERN: (state, { payload: { pattern } }) => ({
		...state,
		value: pattern
	}),
	SHOW: state => ({ ...state, value: '' })
})({ value: '', id: '' })

const index: Reducer<number, *> = reducerCreator({
	SET_INDEX: returnPayload('value'),
	SET_DATA: 0,
	SET_PATTERN: 0,
	SHOW: 0,
	REMOVE_ITEM: 0
})(0)

const offset: Reducer<number, *> = reducerCreator({
	SET_OFFSET: returnPayload('value'),
	SET_DATA: 0,
	SET_PATTERN: 0,
	SHOW: 0
})(0)

const extraInput: Reducer<
	{
		value: string,
		id: string | null
	},
	*
> = reducerCreator({
	SHOW_INPUT: (state, { payload }) => payload,
	SET_EXTRA_INPUT_VALUE: (state, { value }) => ({ ...state, value }),
	HIDE: { value: '', id: null }
})({ value: '', id: null })

const smartCase: Reducer<boolean, *> = reducerCreator({
	TOGGLE_SMART_CASE: state => !state
})(true)

const literalSearch: Reducer<boolean, *> = reducerCreator({
	TOGGLE_LITERAL_SEARCH: state => !state
})(false)

const wholeWord: Reducer<boolean, *> = reducerCreator({
	TOGGLE_WHOLE_WORD: state => !state
})(false)

const scope: Reducer<string, *> = reducerCreator({
	SHOW_SEARCH: returnPayload('scope'),
	SET_SCOPE: returnPayload('scope')
})('')

const reducers = {
	visible,
	options,
	data,
	sparklingData,
	index,
	offset,
	pattern,
	findVisible,
	find,
	replace,
	extraInput,
	smartCase,
	literalSearch,
	scope,
	wholeWord
}

export default reducers
