import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { getFind, isFindVisible } from '../selectors'
import Find from './Find'

class FindContainer extends Component {
	render() {
		if (!this.props.visible) {
			return null
		}

		return <Find {...this.props} />
	}
}

export default connect(
	state => ({
		visible: isFindVisible(state),
		find: getFind(state)
	}),
	dispatch => ({
		setFind: find => dispatch({ type: 'SET_SEARCH', payload: { find } })
	})
)(FindContainer)
