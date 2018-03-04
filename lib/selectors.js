// @flow

import type { State, Item } from './types'

export const isVisible = (state: State): boolean => state.visible
export const getOptions = (state: State) => state.options
export const getData = (state: State): Array<Item> => state.data
export const getIndex = (state: State): number => state.index
export const getOffset = (state: State): number => state.offset
export const getPattern = (state: State): string => state.pattern.value
export const getSelectedValue = (state: State): Item =>
	getSparklingData(state)[getOffset(state) + getIndex(state)]
export const getRawDataLength = (state: State): number => state.data.length
export const getSparklingData = (state: State): Array<Item> =>
	state.sparklingData
export const getFind = (state: State): string => state.find
export const isFindVisible = (state: State): boolean => state.findVisible
export const getReplace = (state: State): string => state.replace
export const getExtraInput = (
	state: State
): {| +value: string, +id: string, +originPath?: string |} => state.extraInput
export const isSmartCase = (state: State): boolean => state.smartCase
export const getScope = (state: State): string => state.scope
export const isLiteralSearch = (state: State): boolean => state.literalSearch
export const isWholeWord = (state: State): boolean => state.wholeWord
