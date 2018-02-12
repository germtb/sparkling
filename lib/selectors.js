import { createSelector } from 'reselect'

export const isVisible = state => state.visible
export const getOptions = state => state.options
export const getData = state => state.data
export const getIndex = state => state.index
export const getOffset = state => state.offset
export const getPattern = state => state.pattern
export const getSelectedValue = state =>
	getSparklingData(state)[getOffset(state) + getIndex(state)]

export const getRawDataLength = state => state.data.length

export const getSparklingData = state => state.sparklingData

// export const getSparklingData = createSelector(
// 	getData,
// 	getPattern,
// 	(data, pattern) => {
// 		if (pattern.length < 2) {
// 			return data
// 		}
//
// 		return fz.filter(data, pattern, { key: 'value' })
// 	}
// )
