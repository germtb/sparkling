import { h } from 'preact'
import { connect } from 'preact-redux'

import { getFind, isFindVisible } from '../selectors'
import Input from './Input'

const FindContainer = ({ visible, value, setValue }) => {
	if (!visible) {
		return null
	}

	return (
		<div className="sparkling-input-container">
			<Input
				className="sparking-find"
				autoFocus
				value={value}
				setValue={setValue}
				placeholder="Find in project"
			/>
		</div>
	)
}

export default connect(
	state => ({
		visible: isFindVisible(state),
		value: getFind(state)
	}),
	dispatch => ({
		setValue: find => dispatch({ type: 'SET_SEARCH', payload: { find } })
	})
)(FindContainer)
