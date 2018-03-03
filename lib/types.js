export type Item = { value: 'string' }

type ShowAction = { type: 'SHOW' }
type HideAction = { type: 'HIDE' }
type ShowSearchAction = {
	type: 'SHOW_SEARCH',
	payload: { find: string, scope: string }
}
type ShowExtraInputAction = {
	type: 'SHOW_INPUT',
	payload: {
		value: string,
		id: string
	}
}
type SetSearchAction = { type: 'SET_SEARCH', payload: { find: string } }
type SetReplaceAction = { type: 'SET_REPLACE', payload: { replace: string } }
type AppendDataAction = { type: 'APPEND_DATA', payload: { data: Array<Item> } }
type ReloadAction = { type: 'RELOAD' }
type RemoveItemAction = { type: 'REMOVE_ITEM', payload: { item: Item } }
type SetFilteredDataAction = {
	type: 'SET_FILTERED_DATA',
	payload: { data: Array<Item> }
}
type SetPatternAction = { type: 'SET_PATTERN', payload: { pattern: string } }
type SetIndexAction = { type: 'SET_INDEX', payload: { value: number } }
type SetDataAction = { type: 'SET_DATA', payload: { data: Array<Item> } }
type SetOffsetAction = { type: 'SET_OFFSET', payload: { value: number } }
type SetExtraInputValueAction = {
	type: 'SET_EXTRA_INPUT_VALUE',
	payload: { value: string }
}
type ToggleSmartCaseAction = { type: 'TOGGLE_SMART_CASE' }
type ToggleLiteralSearchAction = { type: 'TOGGLE_LITERAL_SEARCH' }
type ToggleWholeWordAction = { type: 'TOGGLE_WHOLE_WORD' }
type SetScopeAction = { type: 'SET_SCOPE', payload: { scope: string } }

type ActionWihtoutPayload =
	| ShowAction
	| HideAction
	| ReloadAction
	| ToggleSmartCaseAction
	| ToggleLiteralSearchAction
	| ToggleWholeWordAction

export type ActionWithPayload =
	| ShowSearchAction
	| ShowExtraInputAction
	| SetSearchAction
	| SetReplaceAction
	| AppendDataAction
	| RemoveItemAction
	| SetFilteredDataAction
	| SetPatternAction
	| SetIndexAction
	| SetDataAction
	| SetOffsetAction
	| SetExtraInputValueAction
	| SetScopeAction

export type Action = ActionWihtoutPayload | ActionWithPayload
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

type Reducer<T1, T2: Action> = (T1, T2) => T1

export type CombineReducers = ({ [string]: Reducer<*, *> }) => Reducer<{}>

export type ReducerCreator<T> = ({
	[string]: T | Reducer<T, ActionWithPayload>
}) => T => Reducer<T, *>

export type Dispatch = Action => void

export type GetState = () => State

export type Thunk<T> = T => (Dispatch, GetState) => void
