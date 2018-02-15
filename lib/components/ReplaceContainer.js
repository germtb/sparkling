import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { getSearch, getReplace, isReplaceVisible } from '../selectors'
import Replace from './Replace'

class ReplaceContainer extends Component {
	render() {
		if (!this.props.visible) {
			return null
		}

		return <Replace {...this.props} />
	}
}

export default connect(
	state => ({
		visible: isReplaceVisible(state),
		search: getSearch(state),
		replace: getReplace(state)
	}),
	dispatch => ({
		setSearch: search => dispatch({ type: 'SET_SEARCH', payload: { search } }),
		setReplace: replace =>
			dispatch({ type: 'SET_REPLACE', payload: { replace } })
	})
)(ReplaceContainer)
