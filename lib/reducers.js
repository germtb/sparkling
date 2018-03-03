// @flow

import type { Item, Action } from './actions'

export type Options = {
	loadData: ((Array<Item>) => void) => void,
	accept: Item => void,
	onValue: Item => void,
	renderer: () => void,
	sliceLength: number,
	columns: number,
	description: string,
	id: string,
	path: ?string
}

export type State = {|
	visible: boolean,
	options: Options,
	data: Array<Item>,
	sparklingData: Array<Item>,
	index: number,
	offset: number,
	pattern: { value: string, id: string },
	findVisible: boolean,
	find: string,
	replace: string,
	extraInput: { value: string, id: string },
	scope: string,
	smartCase: boolean,
	literalSearch: boolean,
	wholeWord: boolean
|}

type Reducer<T1, Action> = (T1, Action) => T1

type ReducerCreator<T> = ({ [string]: T | Reducer<T> }) => T => Reducer<T, *>

const reducerCreator: ReducerCreator<*> = actions => initialState => (
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
	SHOW_INPUT: false
})(false)

const findVisible = reducerCreator({
	SHOW_SEARCH: true,
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

const extraInput = reducerCreator({
	SHOW_INPUT: returnPayload(),
	SET_EXTRA_INPUT_VALUE: (state, { value }) => ({ ...state, value }),
	HIDE: { value: '', id: null }
})({ value: '', id: null })

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

export default ({ combineReducers }) =>
	combineReducers({
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
	})
