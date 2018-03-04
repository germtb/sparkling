// @flow

export type Item = { +value: string }

export type ShowActionType = 'SHOW'
export type HideActionType = 'HIDE'
export type ShowSearchActionType = 'SHOW_SEARCH'
export type ShowInputActionType = 'SHOW_INPUT'
export type SetSearchActionType = 'SET_SEARCH'
export type SetReplaceActionType = 'SET_REPLACE'
export type AppendDataActionType = 'APPEND_DATA'
export type ReloadActionType = 'RELOAD'
export type RemoveItemActionType = 'REMOVE_ITEM'
export type SetFilteredDataActionType = 'SET_FILTERED_DATA'
export type SetPatternActionType = 'SET_PATTERN'
export type SetIndexActionType = 'SET_INDEX'
export type SetDataActionType = 'SET_DATA'
export type SetOffsetActionType = 'SET_OFFSET'
export type SetExtraInputValueActionType = 'SET_EXTRA_INPUT_VALUE'
export type ToggleSmartCaseActionType = 'TOGGLE_SMART_CASE'
export type ToggleLiteralSearchActionType = 'TOGGLE_LITERAL_SEARCH'
export type ToggleWholeWordActionType = 'TOGGLE_WHOLE_WORD'
export type SetScopeActionType = 'SET_SCOPE'

export type ActionType =
	| ShowActionType
	| HideActionType
	| ShowSearchActionType
	| ShowInputActionType
	| SetSearchActionType
	| SetReplaceActionType
	| AppendDataActionType
	| ReloadActionType
	| RemoveItemActionType
	| SetFilteredDataActionType
	| SetPatternActionType
	| SetIndexActionType
	| SetDataActionType
	| SetOffsetActionType
	| SetExtraInputValueActionType
	| ToggleSmartCaseActionType
	| ToggleLiteralSearchActionType
	| ToggleWholeWordActionType
	| SetScopeActionType

export type ShowAction = {| +type: ShowActionType, +payload: Options |}
export type HideAction = {| +type: HideActionType |}
export type ShowSearchAction = {|
	+type: ShowSearchActionType,
	+payload: { +find: string, +scope: string }
|}
export type ShowInputAction = {|
	+type: ShowInputActionType,
	+payload: {|
		+value: string,
		+id: string
	|}
|}
export type SetSearchAction = {|
	+type: SetSearchActionType,
	+payload: {| +find: string |}
|}
export type SetReplaceAction = {|
	+type: SetReplaceActionType,
	+payload: {| +replace: string |}
|}
export type AppendDataAction = {|
	+type: AppendDataActionType,
	+payload: {| +data: Array<Item> |}
|}
export type ReloadAction = {| +type: ReloadActionType |}
export type RemoveItemAction = {|
	+type: RemoveItemActionType,
	+payload: { +item: Item }
|}
export type SetFilteredDataAction = {|
	+type: SetFilteredDataActionType,
	+payload: { data: Array<Item> }
|}
export type SetPatternAction = {|
	+type: SetPatternActionType,
	+payload: { pattern: string }
|}
export type SetIndexAction = {|
	+type: SetIndexActionType,
	+payload: { +value: number }
|}
export type SetDataAction = {|
	+type: SetDataActionType,
	+payload: { data: Array<Item> }
|}
export type SetOffsetAction = {|
	+type: SetOffsetActionType,
	+payload: { +value: number }
|}
export type SetExtraInputValueAction = {|
	+type: SetExtraInputValueActionType,
	+payload: { +value: string }
|}
export type ToggleSmartCaseAction = {| +type: ToggleSmartCaseActionType |}
export type ToggleLiteralSearchAction = {|
	+type: ToggleLiteralSearchActionType
|}
export type ToggleWholeWordAction = {| +type: ToggleWholeWordActionType |}
export type SetScopeAction = {|
	+type: SetScopeActionType,
	+payload: {| scope: string |}
|}

type ActionWihtoutPayload =
	| HideAction
	| ReloadAction
	| ToggleSmartCaseAction
	| ToggleLiteralSearchAction
	| ToggleWholeWordAction

export type ActionWithPayload =
	| ShowAction
	| ShowSearchAction
	| ShowInputAction
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
	loadData: (onDone: (Array<Item>) => void) => void,
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
	+visible: boolean,
	+options: Options,
	+data: Array<Item>,
	+sparklingData: Array<Item>,
	+index: number,
	+offset: number,
	+pattern: {| +value: string, +id: string |},
	+findVisible: boolean,
	+find: string,
	+replace: string,
	+extraInput: {| +value: string, +id: string, +originPath?: string |},
	+scope: string,
	+smartCase: boolean,
	+literalSearch: boolean,
	+wholeWord: boolean
|}

import typeof React from 'react'
import type { Component } from 'react'
import typeof { Observable } from 'rxjs/Observable'
import typeof { createStore, combineReducers } from 'redux'
import typeof { Provider, connect } from 'react-redux'
import type { Store as ReduxStore, Reducer } from 'redux'

export type ReducerCreator<T> = ({
	[string]: T | Reducer<T, ActionWithPayload>
}) => T => Reducer<T, *>
export type GetState = () => State
export type Selector<T> = (state: State) => T
export type Dispatch = (action: Action | Thunk) => void
export type Thunk = (Dispatch, GetState) => void
export type Store = ReduxStore<State, Action, Dispatch>

export type MutableDependencies = {
	React: React,
	Observable: Observable,
	filter: (pattern: string, data: Array<Item>) => Array<Item>,
	wrap: (pattern: string, data: string) => string,
	createStore: createStore,
	combineReducers: combineReducers<State, Action>,
	store: Store,
	fromAction: string => Observable,
	fromSelector: (selector: Selector<*>) => Observable,
	Provider: Provider,
	connect: connect,
	components: {
		Input: Component<{}>
	},
	commandFactory: () => void
}

export type Dependencies = {
	+React: React,
	+Observable: Observable,
	+filter: (pattern: string, data: Array<Item>) => Array<Item>,
	+wrap: (pattern: string, data: string) => string,
	+createStore: createStore,
	+combineReducers: combineReducers<State, Action>,
	+store: Store,
	+fromAction: string => Observable,
	+fromSelector: (selector: Selector<*>) => Observable,
	+Provider: Provider,
	+connect: connect,
	+components: {|
		+Input: Component<{}>
	|},
	+commandFactory: () => void
}

export type CombineReducers = combineReducers<*, Action>