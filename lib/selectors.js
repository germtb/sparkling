export const isVisible = state => state.visible
export const getOptions = state => state.options
export const getData = state => state.data
export const getIndex = state => state.index
export const getOffset = state => state.offset
export const getPattern = state => state.pattern.value
export const getSelectedValue = state =>
	getSparklingData(state)[getOffset(state) + getIndex(state)]
export const getRawDataLength = state => state.data.length
export const getSparklingData = state => state.sparklingData
export const getFind = state => state.find
export const isFindVisible = state => state.findVisible
export const getReplace = state => state.replace
export const isReplaceVisible = state => state.replaceVisible
export const getExtraInput = state => state.extraInput
export const isSmartCase = state => state.smartCase
export const getScope = state => state.scope
export const isLiteralSearch = state => state.literalSearch
export const isWholeWord = state => state.wholeWord
