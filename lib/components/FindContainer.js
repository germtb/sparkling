import classNames from 'classnames'

import {
	getFind,
	isFindVisible,
	isSmartCase,
	getScope,
	isLiteralSearch,
	isWholeWord
} from '../selectors'

export default ({ React, connect, Input }) => {
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
		// toggleWholeWord,
		// wholeWord
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
							['sparkling-toggle-active']: smartCase
						})}
					>
						Smart case
					</button>
					<button
						onClick={toggleLiteralSearch}
						className={classNames('sparkling-toggle', {
							['sparkling-toggle-active']: literalSearch
						})}
					>
						Literal search
					</button>
					{/* <button
						onClick={toggleWholeWord}
						className={classNames('sparkling-toggle', {
							['sparkling-toggle-active']: wholeWord
						})}
					>
						Whole word
					</button> */}
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

	return connect(
		state => ({
			visible: isFindVisible(state),
			value: getFind(state),
			smartCase: isSmartCase(state),
			literalSearch: isLiteralSearch(state),
			scope: getScope(state),
			wholeWord: isWholeWord(state)
		}),
		dispatch => ({
			setValue: find => dispatch({ type: 'SET_SEARCH', payload: { find } }),
			toggleSmartCase: () => dispatch({ type: 'TOGGLE_SMART_CASE' }),
			toggleLiteralSearch: () => dispatch({ type: 'TOGGLE_LITERAL_SEARCH' }),
			setScope: scope => dispatch({ type: 'SET_SCOPE', payload: { scope } }),
			toggleWholeWord: () => dispatch({ type: 'TOGGLE_WHOLE_WORD' })
		})
	)(FindContainer)
}
