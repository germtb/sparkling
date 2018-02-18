import { h } from 'preact'
import { connect } from 'preact-redux'
import classNames from 'classnames'

import { getFind, isFindVisible, isSmartCase } from '../selectors'
import Input from './Input'

const FindContainer = ({
	visible,
	value,
	setValue,
	toggleSmartCase,
	smartCase
}) => {
	if (!visible) {
		return null
	}

	return (
		<div className="sparkling-input-container">
			<div className="sparkling-find-options">
				<button
					onClick={toggleSmartCase}
					className={classNames('sparkling-toggle', {
						['sparking-toggle-active']: smartCase
					})}
				>
					Smart case
				</button>
			</div>
			<Input
				className="sparkling-find"
				autoFocus
				value={value}
				setValue={setValue}
				placeholder="Enter to find, shift Enter to replace"
			/>
		</div>
	)
}

export default connect(
	state => ({
		visible: isFindVisible(state),
		value: getFind(state),
		smartCase: isSmartCase(state)
	}),
	dispatch => ({
		setValue: find => dispatch({ type: 'SET_SEARCH', payload: { find } }),
		toggleSmartCase: () => dispatch({ type: 'TOGGLE_SMART_CASE' })
	})
)(FindContainer)
