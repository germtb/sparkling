import { h } from 'preact'
import { connect } from 'preact-redux'

import { getExtraInput } from '../selectors'
import Input from './Input'

const ExtraInputContainer = ({ extraInput, setValue }) => {
	const { value, id, placeholder = '' } = extraInput
	if (!id) {
		return null
	}

	return (
		<div id={id} className="sparkling-input-container">
			<Input
				autoFocus
				value={value}
				setValue={setValue}
				placeholder={placeholder}
			/>
		</div>
	)
}

export default connect(
	state => ({
		extraInput: getExtraInput(state)
	}),
	dispatch => ({
		setValue: value =>
			dispatch({ type: 'SET_EXTRA_INPUT_VALUE', payload: { value } })
	})
)(ExtraInputContainer)