// @flow

import typeof React from 'react'
import type { PureComponent, ComponentType, Element } from 'react'
import typeof { Observable as ObservableClass } from 'rxjs/Observable'
import type { Observable } from 'rxjs/Observable'
import typeof Fuzzysort from 'fuzzysort'
import typeof { createStore, combineReducers } from 'redux'
import type { Store as ReduxStore } from 'redux'
import typeof { Provider, connect } from 'react-redux'
import typeof Classnames from 'classnames'

export type GitStatus =
	| 'M '
	| ' M'
	| 'MM'
	| '??'
	| 'D '
	| ' D'
	| 'AD'
	| 'DD'
	| 'A '
	| ' A'
	| 'AM'

export type SimpleItem = {| +value: string |}
export type GitFileItem = {| +value: string, +status: GitStatus |}
export type LsItem = {|
	+value: string,
	+absolutePath: string,
	isFolder: boolean
|}
export type LineItem = {|
	+value: string,
	+path: string,
	+line: string,
	+lineNumber: number
|}
export type EmojiItem = {|
	+value: string,
	+emoji: string
|}
export type AckmateItem = {|
	value: string,
	match: string,
	path: string,
	startLine: number,
	startColumn: number,
	endLine: number,
	endColumn: number
|}
export type CommandItem = {|
	+value: string,
	+name: string,
	+keybinding?: { keystrokeArray: Array<string> },
	+activeElement: HTMLElement
|}
export type TokenItem = {|
	+value: string,
	+range: Range
|}
export type BufferLineItem = {|
	+value: string,
	+lineNumber: number
|}

export type Item =
	| SimpleItem
	| GitFileItem
	| LsItem
	| LineItem
	| EmojiItem
	| AckmateItem
	| TokenItem
	| BufferLineItem

export type ShowActionType = 'SHOW'
export type HideActionType = 'HIDE'
export type ShowSearchActionType = 'SHOW_SEARCH'
export type ShowInputActionType = 'SHOW_EXTRA_INPUT'
export type SetSearchActionType = 'SET_SEARCH'
export type SetReplaceActionType = 'SET_REPLACE'
export type AppendDataActionType = 'APPEND_DATA'
export type ReloadActionType = 'RELOAD'
export type RemoveItemActionType = 'REMOVE_ITEM'
export type SetFilteredDataActionType = 'SET_FILTERED_DATA'
export type SetPatternActionType = 'SET_PATTERN'
export type SetIndexActionType = 'SET_INDEX'
export type SetDataActionType = 'SET_DATA'
export type SetExtraInputValueActionType = 'SET_EXTRA_INPUT'
export type ToggleSmartCaseActionType = 'TOGGLE_SMART_CASE'
export type ToggleLiteralSearchActionType = 'TOGGLE_LITERAL_SEARCH'
export type ToggleWholeWordActionType = 'TOGGLE_WHOLE_WORD'
export type SetScopeActionType = 'SET_SCOPE'
export type SelectType = 'SELECT'

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
	| SetExtraInputValueActionType
	| ToggleSmartCaseActionType
	| ToggleLiteralSearchActionType
	| ToggleWholeWordActionType
	| SetScopeActionType
	| SelectType

export type ShowAction = {| +type: ShowActionType, +payload: Options |}
export type HideAction = {| +type: HideActionType |}
export type ShowSearchAction = {|
	+type: ShowSearchActionType,
	+payload: { +find: string, +scope: string }
|}
export type ShowInputAction = {|
	+type: ShowInputActionType,
	+payload: {
		+value: string,
		+id: string,
		[string]: any
	}
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
export type SelectAction = {| +type: SelectType, +payload: {| +item: Item |} |}

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
	| SetExtraInputValueAction
	| SetScopeAction
	| SelectAction

export type Action = ActionWihtoutPayload | ActionWithPayload

export type Cancel = () => void

export type LoadData<T> = (onDone: (Array<T>) => void) => Cancel

export type Renderer<T> = ComponentType<{|
	+item: T,
	+className: string,
	+pattern: string,
	+index: number,
	+selectedIndex: number,
	+accept: T => void,
	+multiselected: boolean
|}>

export type Options = SimpleOptions<*> | SimpleMultiselectOptions<*>

type BaseOptions<T> = {
	+loadData: LoadData<T>,
	+id: string,
	+description: string,
	+renderer: Renderer<T>,
	+sliceLength: number,
	columns: number
}

type SimpleOptions<T> = {
	...$Exact<BaseOptions<T>>,
	+accept: T => void,
	+multiselect: false
}

type SimpleMultiselectOptions<T> = {
	...$Exact<BaseOptions<T>>,
	+accept: (Array<T>) => void,
	+multiselect: true
}

export type State = {|
	+visible: boolean,
	+options: Options,
	+data: Array<Item>,
	+sparklingData: Array<Item>,
	+index: number,
	+pattern: {| +value: string, +id: string |},
	+findVisible: boolean,
	+find: string,
	+replace: string,
	+extraInput: { id?: string, [string]: any },
	+scope: string,
	+smartCase: boolean,
	+literalSearch: boolean,
	+wholeWord: boolean,
	+multiselected: Array<Item>
|}

export type GetState = () => State

export type Selector<T> = (state: State) => T

export type FromSelector<T> = (Selector<T>) => Observable<T>

export type FromAction = string => Observable<void>

export type Thunk = (Dispatch, GetState) => void

export type Dispatch = (action: Action | Thunk) => void

export type Store = ReduxStore<State, Action, Dispatch>

export type CombineReducers = combineReducers<*, Action>

export type Filter = (
	pattern: string,
	data: Array<Item>
) => Promise<Array<Item>>

export type CommandFactory = (
	(Dependencies) => any
) => ({ [string]: any }) => void

export type Wrap = (
	data: string,
	pattern: string
) => Array<string | Element<string>>

export type FileIconService = {
	iconClassForPath: string => Array<string>
}

export type Dependencies = {|
	+utils: {|
		+iconClassForPath: FileIconService
	|},
	+React: React,
	+classnames: Classnames,
	+Observable: ObservableClass,
	+fuzzysort: Fuzzysort,
	+filter: Filter,
	+wrap: Wrap,
	+createStore: createStore,
	+combineReducers: CombineReducers,
	+store: Store,
	+fromAction: FromAction,
	+fromSelector: FromSelector<*>,
	+Provider: Provider,
	+connect: connect,
	+components: {|
		+Input: PureComponent<{|
			+autoFocus: boolean,
			+value: string,
			+setValue: string => void,
			+placeholder: string
		|}>,
		+Sparkling: PureComponent<{}>,
		+FindContainer: PureComponent<{}>,
		+ExtraInputContainer: PureComponent<{}>,
		+withSideEffect: any
	|},
	+commandFactory: CommandFactory
|}
