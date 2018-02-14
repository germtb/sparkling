import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { getSearch, isSearchVisible } from '../selectors'
import Search from './Search'

class SearchContainer extends Component {
	render() {
		if (!this.props.visible) {
			return null
		}

		return <Search {...this.props} />
	}
}

export default connect(
	state => ({
		visible: isSearchVisible(state),
		search: getSearch(state)
	}),
	dispatch => ({
		setSearch: search => dispatch({ type: 'SET_SEARCH', payload: { search } })
	})
)(SearchContainer)
