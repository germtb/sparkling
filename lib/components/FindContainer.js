import { h } from 'preact'
import { connect } from 'preact-redux'
import classNames from 'classnames'

import {
	getFind,
	isFindVisible,
	isSmartCase,
	getScope,
	isLiteralSearch
} from '../selectors'
import Input from './Input'

const FindContainer = ({
	visible,
	value,
	setValue,
	toggleSmartCase,
	smartCase,
	scope,
	setScope,
	toggleLiteralSearch,
	literalSearch
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
				<button
					onClick={toggleLiteralSearch}
					className={classNames('sparkling-toggle', {
						['sparking-toggle-active']: literalSearch
					})}
				>
					Literal search
				</button>
			</div>
			<Input
				tabIndex={0}
				className="sparkling-find"
				autoFocus
				value={value}
				setValue={setValue}
				placeholder="Enter to find, shift Enter to replace"
			/>
			<Input
				tabIndex={1}
				className="sparkling-scope"
				value={scope}
				setValue={setScope}
				placeholder="Scope. Leave empty to search whole project"
			/>
		</div>
	)
}

export default connect(
	state => ({
		visible: isFindVisible(state),
		value: getFind(state),
		smartCase: isSmartCase(state),
		literalSearch: isLiteralSearch(state),
		scope: getScope(state)
	}),
	dispatch => ({
		setValue: find => dispatch({ type: 'SET_SEARCH', payload: { find } }),
		toggleSmartCase: () => dispatch({ type: 'TOGGLE_SMART_CASE' }),
		toggleLiteralSearch: () => dispatch({ type: 'TOGGLE_LITERAL_SEARCH' }),
		setScope: scope => dispatch({ type: 'SET_SCOPE', payload: { scope } })
	})
)(FindContainer)
