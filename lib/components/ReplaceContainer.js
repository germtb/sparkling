import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { getFind, getReplace, isReplaceVisible } from '../selectors'
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
		find: getFind(state),
		replace: getReplace(state)
	}),
	dispatch => ({
		setFind: find => dispatch({ type: 'SET_SEARCH', payload: { find } }),
		setReplace: replace =>
			dispatch({ type: 'SET_REPLACE', payload: { replace } })
	})
)(ReplaceContainer)
