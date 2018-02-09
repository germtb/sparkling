import { createSelector } from 'reselect'
import fz from 'fuzzaldrin-plus'

export const isVisible = state => state.visible
export const getCMD = state => state.cmd
export const getAccept = state => state.accept
export const getData = state => state.data
export const getIndex = state => state.index
export const getPattern = state => state.pattern
export const getSelectedValue = state => {
	return getSparklingData(state)[getIndex(state)]
}

export const getSparklingData = createSelector(
	getData,
	getPattern,
	(data, pattern) => {
		if (pattern.length < 2) {
			return data.slice(0, 10)
		}

		return fz.filter(data, pattern).slice(0, 10)
	}
)
